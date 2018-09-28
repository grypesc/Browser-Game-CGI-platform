'use strict';

let Model =  require ('./static/server/Model.js');
let model = new Model();
let express = require('express');
let http = require('http');
let path = require('path');
let socketIO = require('socket.io');

let app = express();
let server = http.Server(app);
let io = socketIO(server);

let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('port', 54070);
app.use('/static', express.static(__dirname + '/static'));


// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

app.post('', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
  playersInQueue.push(req.body.nick);


});

server.listen(54070, "0.0.0.0");




require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})


let bulletPhysics = model.getBulletPhysics();
let players = {};
let playersInQueue = [];

io.on('connection', function(socket) {
  socket.on('new player', function() {
    if (playersInQueue.length > 0)
      players[socket.id] = model.getNewPlayer(Math.floor(Math.random()*5000),Math.floor(Math.random()*5000),1000,0, playersInQueue.shift());
    else { // this prevents nonames form joining to game
        players[socket.id] = model.getNewPlayer(0,0,-1000,0, 'noName');
      }
    console.log("Player connected: " +socket.id);
    console.log(players);
  });

  socket.on('disconnect', function() {
    delete players[socket.id];
  });

  socket.on('input', function(input) {
    let player = players[socket.id] || {};
    let speed = model.map.square[Math.floor((player.y)/50)][Math.floor((player.x)/50)].speed;
    player.health -= model.map.square[Math.floor((player.y)/50)][Math.floor((player.x)/50)].damage;

    player.direction=input.direction;
    if (input.left) {
      player.x -= speed;
    }
    if (input.up) {
      player.y -= speed;
    }
    if (input.right) {
      player.x += speed;
    }
    if (input.down) {
      player.y += speed;
    }
    if (player.x<50) player.x=50;
    else if (player.x>100*50-50) player.x=100*50-50;
    if (player.y<50) player.y=50;
    else if (player.y>100*50-50) player.y=100*50-50;

    if (input.LMB == true)
    {
      bulletPhysics.bullets.push(model.getBullet( player.x + 50*Math.cos(player.direction),
                                                  player.y + 50*Math.sin(player.direction),
                                                  player.direction));
    }
  });


});

let playerMap=[];//used to send map to players, they get only 21x17 squares
for (let i = 0; i < 17; i++) {
  playerMap[i] = [];
  for (let j = 0; j < 21; j++) {
    playerMap[i][j]='grass';
  }
}

setInterval(function() {
  bulletPhysics.checkRange();
  bulletPhysics.update();
  bulletPhysics.checkHits(players);

  for (let key in players) {
    let thisPlayer=players[key];//players
    let thisPlayerAbsolute=thisPlayer;
    let emitPlayers = JSON.parse(JSON.stringify(players));
    for (let key2 in emitPlayers) {
      emitPlayers[key2].x=emitPlayers[key2].x - thisPlayer.x + 500;
      emitPlayers[key2].y=emitPlayers[key2].y - thisPlayer.y + 400;
    }

    if (io.sockets.connected[key] && thisPlayer.health <= 0) {
    io.to(key).emit('death');
    io.sockets.connected[key].disconnect();
    continue;
}



    for (let i = 0; i < 17; i++) {
      for (let j = 0; j < 21; j++) {
        playerMap[i][j]=model.map.square[Math.min(Math.max(Math.floor(players[key].y/50)-8+i , 0) , 99)]
                                  [Math.min(Math.max(Math.floor(players[key].x/50)-10+j , 0) , 99)].type;
      }
    }

    io.to(key).emit('update', emitPlayers, thisPlayer, thisPlayerAbsolute, playerMap, bulletPhysics.bullets);
  }}, 1000 / 60);





////////////////////////////////////////////////////////////////////////////////

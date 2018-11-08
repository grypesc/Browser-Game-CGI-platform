'use strict';
let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}



let app = new PIXI.Application({
  width: controller.width,
  height: controller.height,
  antialias: true,
  transparent: false,
  resolution: 1
}
);


PIXI.loader
.add("static/client/sprites/grass.png")
.add("static/client/sprites/sand.png")
.add("static/client/sprites/edge.png")
.add("static/client/sprites/water.png")
.add("static/client/sprites/lava.png")
.add("static/client/sprites/player.png")
.add("static/client/sprites/hand.png")
.add("static/client/sprites/bullet.png")
.add("static/client/sprites/dead.png")
.load(setup);
function setup() {
controller.newPlayer();
controller.emitInput();
controller.listenToUpdate();
controller.listenToDeath();
app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
app.stage.removeChildren();
if (controller.mode == 'dead')
{
  let deadSprite = new PIXI.Sprite(PIXI.loader.resources['static/client/sprites/dead.png'].texture);
  deadSprite.position.set(0,0);
  app.stage.addChild(deadSprite);
  return;
}

for (let i = 0; i < 17; i++) {
  for (let j = 0; j < 21; j++) {
    let square = new PIXI.Sprite(PIXI.loader.resources[gameMap.square[i][j].path].texture);
    square.x=controller.squareWidthInPixels*j-currentPlayer.xAbsolute%50;
    square.y=controller.squareHeightInPixels*i-currentPlayer.yAbsolute%50;
    app.stage.addChild(square);
  }
}
for (let id in players) {
  let player = players[id];
  let playerSprite = new PIXI.Sprite(PIXI.loader.resources['static/client/sprites/player.png'].texture);
  playerSprite.anchor.set(0.5,0.5);
  playerSprite.position.set(player.x,player.y);
  app.stage.addChild(playerSprite);

  let handSprite = new PIXI.Sprite(PIXI.loader.resources['static/client/sprites/hand.png'].texture);
  handSprite.anchor.set=(0.5,0.5);
  handSprite.rotation = player.direction;
  handSprite.x=player.x+30*Math.cos(player.direction);
  handSprite.y=player.y+30*Math.sin(player.direction);
  app.stage.addChild(handSprite);

  let name = new PIXI.Text(player.name);
  name.style = {fill: 'white', stroke: 'black', strokeThickness: 2};
  name.anchor.set(0.5,0.5);
  name.position.set(player.x, player.y-55);
  app.stage.addChild(name);

  let redBar = new PIXI.Graphics();
  redBar.lineStyle(1, 0x000000, 1);
  redBar.beginFill(0xFF0000);
  redBar.drawRect(player.x-40, player.y-40, 80, 10);
  redBar.endFill();
  app.stage.addChild(redBar);

  let greenBar = new PIXI.Graphics();
  greenBar.lineStyle(1, 0x000000, 1);
  greenBar.beginFill(0x008111);
  greenBar.drawRect(player.x-40, player.y-40, Math.max(0,player.health*(80/1000)), 10);
  greenBar.endFill();
  app.stage.addChild(greenBar);
}

let length = bullets.length;
for (let i=0; i<length; i++){
  let bulletSprite = new PIXI.Sprite(PIXI.loader.resources['static/client/sprites/bullet.png'].texture);

  bulletSprite.anchor.set(0.5,0.5);
  bulletSprite.x = bullets[i].x-currentPlayer.xAbsolute+500;
  bulletSprite.y = bullets[i].y-currentPlayer.yAbsolute+400;
  app.stage.addChild(bulletSprite);
}

let map = new PIXI.Graphics();
map.lineStyle(1, 0x000000, 1);
map.beginFill('black', 0.5);
map.drawRect(880, 680, 100, 100);
map.endFill();
app.stage.addChild(map);
for (let id in players) {
  let player = players[id];
  let pointPlayer = new PIXI.Graphics();
  console.log (player.x + ' ' + currentPlayer.x)
  if(player.x == 500 && player.y == 400)
    pointPlayer .beginFill(0x008111);
  else
    pointPlayer .beginFill(0xFF0000);
  console.log(880+(player.x+currentPlayer.xAbsolute-500)/5000*100),
  pointPlayer.drawCircle(880+(player.x+currentPlayer.xAbsolute-500)/5000*100, 680+(player.y+currentPlayer.yAbsolute-400)/5000*100, 3);
  pointPlayer.endFill();
  app.stage.addChild(pointPlayer);
}

}

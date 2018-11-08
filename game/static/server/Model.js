  'use strict';

class Terrain {
  constructor(speedArg, typeArg, damageArg) {
    this.speed = speedArg;
    this.type=typeArg;
    this.damage = damageArg;
  }
}

let sand = new Terrain (3, 'sand', 0);
let edge = new Terrain (3, 'edge', 0);
let grass = new Terrain (5, 'grass', 0);
let water = new Terrain (1, 'water', 0);
let lava = new Terrain (2, 'lava', 5);



class Map {
  constructor() {
    this.square = [];
    this.heightInSquares = 100;
    this.widthInSquares = 100;
    for (let i = 0; i < this.heightInSquares; i++) {
      this.square[i] = [];
      for (let j = 0; j < this.widthInSquares; j++) {
        if (i==0 || j==0 || i==99 || j==99)
          this.square[i][j]=edge;
        else
          this.square[i][j]=grass;

      }
    }
      this.createArea(new Point(1, 1), 50, 0.75, sand);
      this.createArea(new Point(10, 30), 200, 0.75, sand);
      this.createArea(new Point(97, 50), 1000, 0.65, sand);
      this.createArea(new Point(97, 97), 1000, 0.90, water);
      this.createArea(new Point(20, 30), 200, 0.75, water);
      this.createArea(new Point(20, 5), 100, 0.75, water);
      this.createArea(new Point(50, 50), 800, 0.60, water);
      this.createArea(new Point(50, 90), 800, 0.60, lava);
      this.createArea(new Point(2, 2), 30, 0.60, lava);
      }


  createArea(center, size, randomness, type) { ///using a DFS algorithm
    let queue = [];
    queue.push(center);
    let currentSize=0;
    while (queue.length!=0 && currentSize<size)
    {
      let current=queue.shift();
      if (this.square[current.y][current.x] === type)
        continue;
      this.square[current.y][current.x]=type;
      currentSize++;

      if (Math.random()<=randomness && current.x+1 >=1 && current.x+1 <=98 && current.y >= 1 && current.y <=98 && this.square[current.x+1][current.y] !== type) {
        let currentNew = new Point(current.x+1, current.y);
        queue.push(currentNew);
      }
      if (Math.random()<=randomness && current.x >=1 && current.x <=98 && current.y+1 >= 1 && current.y+1 <=98 && this.square[current.x][current.y+1].type !== type) {
        let currentNew = new Point(current.x, current.y+1);
        queue.push(currentNew);
      }
      if (Math.random()<=randomness && current.x-1 >=1 && current.x-1 <=98 && current.y >= 1 && current.y <=98 && this.square[current.x-1][current.y].type !== type) {
        let currentNew = new Point(current.x-1, current.y);
        queue.push(currentNew);
      }
      if (Math.random()<=randomness && current.x >=1 && current.x <=98 && current.y-1 >= 1 && current.y-1 <=98 && this.square[current.x][current.y-1].type !== type) {
        let currentNew = new Point(current.x, current.y-1);
        queue.push(currentNew);
      }
    }
  }
}

class Point {
  constructor(xArg, yArg) {
    this.x=xArg;
    this.y=yArg;
  }
}

class Player {
  constructor(xArg, yArg, healthArg, directionArg, nameArg) {
    this.x = xArg;
    this.y = yArg;
    this.health = healthArg;
    this.direction = directionArg;
    this.name = nameArg;
  }

}

class Bullet {
  constructor(xArg, yArg, directionArg) {
    this.x = xArg;
    this.y = yArg;
    this.direction = directionArg;
    this.speed = 20;
    this.range = 1000;
    this.distanceTraveled = 0;
    this.damage = 300;
  };

}

class BulletPhysics {
  constructor () {
    this.bullets = [];
  }

  update() {
    for (let i=0; i<this.bullets.length; i++){
      this.bullets[i].x += this.bullets[i].speed * Math.cos(this.bullets[i].direction);
      this.bullets[i].y += this.bullets[i].speed * Math.sin(this.bullets[i].direction);
      this.bullets[i].distanceTraveled += this.bullets[i].speed;
    }
  }

  checkRange() {
      let length = this.bullets.length;
      for (let i=0; i<length; i++) {
        if (this.bullets[i].distanceTraveled>=this.bullets[i].range) {
          this.bullets.splice(i,1);
          length--;
          i--;
        }

      }
  }

  checkHits(players) {
    for (let id in players)
    {
      let player=players[id];
      for (let i=0; i<this.bullets.length; i++) {
        if (this.bullets[i].x>=player.x-20 && this.bullets[i].x<=player.x+20 && this.bullets[i].y>=player.y-20 && this.bullets[i].y<=player.y+20) {
          player.health -= this.bullets[i].damage;
          this.bullets.splice(i,1);
          i--;
        }
      }
    }
  }
}

class Weapon {
  constructor(dmg, acc) {
    this.damage = dmg;
    this.accuracy = acc;
  };

}



class Model {
  constructor() {
    this.map = new Map();
  };

  getMap() {
    return this.map;
  }

  getNewPlayer(xArg, yArg, healthArg, directionArg, nameArg) {
    return new Player(xArg, yArg, healthArg, directionArg, nameArg);
  }

  getBulletPhysics(){
    return new BulletPhysics();
  }

  getBullet(xArg, yArg, directionArg){
    return new Bullet(xArg, yArg, directionArg);
  }

}


module.exports = Model;

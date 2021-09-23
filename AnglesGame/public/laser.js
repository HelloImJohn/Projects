function Laser(pPosX, pPosY, angle, id) {
  this.pos = createVector(pPosX, pPosY);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(15);
  this.vel.add(player.vel * 0.9);
  this.damage = 400;
  this.id = id;

  this.update = function() {
    this.pos.add(this.vel);
  }

  this.render = function() {
    push();
    stroke(255);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
  }

  //check if laser hit an obstacle
  this.hit = function () {
    for (var i = 0; i < lasers.length; i++) {
      for (var i = 0; i < obstacles.length; i++) {
        if (this.pos.x <= obstacles[i].x + obstacles[i].w && this.pos.x >= obstacles[i].x && this.pos.y <= obstacles[i].y + obstacles[i].h && this.pos.y >= obstacles[i].y) {
          return true;
        }
      }
    }
  }

//check of laser hit another player
  this.hitOther = function () {
    for (var j = lasers.length - 1; j >= 0; j--) {
      for (var i = players.length - 1; i >= 0; i--) {
        var id = players[i].id;
        if (id !== this.id && this.pos.x  >= players[i].x - player.r && this.pos.x <= players[i].x + player.r && this.pos.y >= players[i].y - player.r && this.pos.y <= players[i].y + player.r) {
          console.log('hit player: ' + id);
          var laserData = {
            damage: this.damage,
            hitID: id
          }
          socket.emit('hitPlayer', laserData);
          return true;
        }
      }
    }
  }

//check if laser is out of bounds
  this.offscreen = function() {
    if (this.pos.x > worldSize.x || this.pos.x < -worldSize.x) {
      return true;
    }
    if (this.pos.y > worldSize.y || this.pos.y < -worldSize.y) {
      return true;
    }
  }
}

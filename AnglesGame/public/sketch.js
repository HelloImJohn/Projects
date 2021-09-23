var player;
var bg = 51
var glow;
var lasers = [];
var obstacles = [];

var bgColor = 51;

var worldSize = {
  x: 2000,
  y: 2000,
};

var players = [];
var id;
var socket;

function setup() {
  socket = io.connect('http://localhost:3000');
  player = new Player();
//  console.log(data);

                      // go to menu to type name and other info(...)

        // Setting localStorage to 'not identified state' do that name is requested ALSO if player refreshes name is requested again.
//// TODO: fix this... (transmit name for login/menu (menu.html to index.html))
  localStorage.setItem ('identified', 'false');


  // recieve data from server
  socket.on('heatbeat', recieve);
    function recieve(data) {
      players = data;
    }
  socket.on('newRect', makeNew);
    function makeNew(globalObstacles) {
      obstacles.push.apply(obstacles, globalObstacles);
      //console.log('hi');
    }
  socket.on('newShot', shoot);
  function shoot(playerID) {
    for (var i = players.length - 1; i >= 0; i--) {
      var id = players[i].id;
      var shootID = playerID;
      if (id !== socket.id && id == shootID) {
        push();
        translate(player.pos.x, player.pos.y);
        lasers.push(new Laser(players[i].x, players[i].y, players[i].heading, shootID));
        pop();
        console.log('shot through server');
      }
    }
  }

  // deal damage to player if is hit by other
  socket.on('dealDamage', takeDamage);
  function takeDamage(laserData) {
    for (var i = players.length - 1; i >= 0; i--) {
      var id = laserData.hitID;
      if (id == socket.id) {
        player.hP -= laserData.damage;
        player.barDifference = player.sHP - player.hP;
        break;
      }
    }
  }

  glow = new Glow();

  createCanvas(window.innerWidth -5, window.innerHeight -5);
  background(bgColor);
  // var name = prompt('Your name');
   //if (name) {
  //   alert('you are a potato '+ name + '.');
   //} else {
  //   alert('You will not be able to save your score, potato.');
   //}
  /*
  for (var i = 0; i < worldSize.x / 22 + worldSize.y / 22 ; i++) {
    console.log('generating...');
    var rectangles = {
      x: random(-worldSize.x, worldSize.x),
      y: random(-worldSize.y, worldSize.y),
      w: random(30,220),
      h: random(30, 220)
    };
    obstacles.push(rectangles);
  }
  */
  var data = {
    x: player.pos.x,
    y: player.pos.y,
    head: player.heading
  }
  socket.emit('start', data);

  // Testing random rectangle coordinate generation for server
  /*
  for (var i = 0; i < worldSize.x / 22 + worldSize.y / 22; i++) {
    var randomTest = Math.floor(Math.random() < 0.5 ? Math.random() * (-worldSize.x + 0) +1 : Math.random() * (0 + worldSize.x) + 1);
    console.log(randomTest);
  }
  */
}

function draw() {
  var hPP = true;
  background(bgColor);
  translate(width / 2 -player.pos.x, height / 2 -player.pos.y);
  for (var i = players.length - 1; i >= 0; i--) {
    var id = players[i].id;
    if (id !== socket.id) {
      /*
      fill(map(players[i].heading, 0, 20, 0, 255));
      ellipse(players[i].x, players[i].y, 40, 40);
      */
      push();
      translate(players[i].x, players[i].y);
      rotate(players[i].heading + PI / 2);
      smooth();
      fill(bgColor);
      strokeWeight(1);
      stroke('rgba(252, 247, 116, 0.8)');
      triangle(-player.r, player.r, player.r, player.r, 0, -player.r);
      pop();
      fill(255);
      textAlign(CENTER);
      textSize(12);
      text(players[i].id, players[i].x, players[i].y +40);
    }
  }
  player.render();
  player.turn();
  player.update();
  player.constrain();
  //player.edges();
  //oR();
  if (!hPP) {
    line(-worldSize.x, worldSize.y, worldSize.x, worldSize.y);
    line(worldSize.x, worldSize.y,  worldSize.x, -worldSize.y);
    line(worldSize.x, -worldSize.y, -worldSize.x, -worldSize.y);
    line(-worldSize.x, -worldSize.y, -worldSize.x, worldSize.y);
  }
                  //particle
  if (player.isBoosting) {
    //glow.postransform();
    //glow.render();
  }
  //glow.postransform();
  //glow.render();
                  //laser
  for (var i = 0; i < lasers.length; i++) {
    lasers[i].render();
    lasers[i].update();
    lasers[i].hit();
    if (lasers[i].offscreen() || lasers[i].hit() || lasers[i].hitOther()) {
      lasers.splice(i, 1);
    //  console.log('DELETED');
    }
  }

  for (var i = 0; i < obstacles.length; i++) {
    fill(bgColor);
    strokeWeight(1);
    stroke(255);
    if (obstacles[i].x <= window.innerWidth + 120 && obstacles[i].y <= window.innerHeight + 120) {
      rect(obstacles[i].x, obstacles[i].y, obstacles[i].w, obstacles[i].h);
      if (hPP) {
        line(-worldSize.x, worldSize.y, worldSize.x, worldSize.y);
        line(worldSize.x, worldSize.y,  worldSize.x, -worldSize.y);
        line(worldSize.x, -worldSize.y, -worldSize.x, -worldSize.y);
        line(-worldSize.x, -worldSize.y, -worldSize.x, worldSize.y);
      }
    }
  }
  player.health();

  var data = {
    x: player.pos.x,
    y: player.pos.y,
    head: player.heading
  }
  socket.emit('update', data);
}

//draw obstacles
/*
function oR() {
  for (var i = 0; i < obstacles.length; i++) {
    fill(bgColor);
    strokeWeight(1);
    stroke(255);
    if (obstacles[i].x <= window.innerWidth && obstacles[i].y <= window.innerHeight) {
      rect(obstacles[i].x, obstacles[i].y, obstacles[i].w, obstacles[i].h);
    }
  }
}
*/

function betested() {
  console.log('WHAT');
}

function windowResized() {
  resizeCanvas(windowWidth -5, windowHeight -5);
}

function keyReleased() {
  if (key == ' ') {
    lasers.push(new Laser(player.pos.x, player.pos.y, player.heading, socket.id));
    socket.emit('shot', socket.id);
    console.log(lasers);
  }
  if (keyCode == RIGHT_ARROW) {
    player.setRotation(0);
  } if (keyCode == LEFT_ARROW) {
    player.setRotation(0);
  } if (keyCode == UP_ARROW) {
    player.boosting(false);
  }
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    player.setRotation(0.1);
  } if (keyCode == LEFT_ARROW) {
    player.setRotation(-0.1);
  } if (keyCode == UP_ARROW) {
    player.boosting(true);
  }
}

function Player() {
  this.iD = 1;
  this.pos = createVector(window.innerWidth / 2 -2.5, window.innerHeight / 2 -2.5);
  this.vel = createVector(0,0);
  this.r = 30;
  this.heading = PI / 2;
  this.rotation = 0;
  this.boosting = false;
  this.sHP = 1000;
  this.hP = this.sHP;
  this.barDifference = 0;
  this.secondBarLenght = map(this.hP, 0, 1000, 0, window.innerWidth - 32);
  this.secondBarSpeed = 0;

  this.boosting = function(b) {
    this.isBoosting = b;
  }

  this.update = function() {
    if (this.isBoosting) {
      this.boost();
    }
    this.pos.add(this.vel);
    // console.log('Boosting');
    this.vel.mult(0.85);
  }

  this.boost = function() {
    var force = p5.Vector.fromAngle(this.heading%(2*PI));
    force.mult(1.2);
    this.vel.add(force);
  }

  this.render = function() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    /*
	if (this.isBoosting) {
    translate(0 , this.r );
	  rotate(PI / 2);
	  noStroke();
    fill('rgba(140,85,70, 0.5)');
    ellipse(0, 0, 30, 60);
	  rotate(-PI / 2);
	  translate(0 , -this.r );
	}
  */
    smooth();
    fill(bgColor);
    strokeWeight(1);
    stroke('#fae');
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
    pop();
  }

  this.health = function () {
    if (this.hP <= 0) {
      this.hP = 0;
    }
    for (var i = 0; i < obstacles.length; i++) {
      if (player.pos.x <= obstacles[i].x + obstacles[i].w && player.pos.x >= obstacles[i].x && player.pos.y <= obstacles[i].y + obstacles[i].h && player.pos.y >= obstacles[i].y) {
        if (this.hP > 0) {
          this.hP -= 1.5;
          this.barDifference = this.sHP - this.hP;
        } else {
          this.hP = 0;
        }
        //console.log(this.hP);
        //console.log(this.sHP);
      }
    }
    if (this.hP == 0 || window.closed) {
      socket.emit('disconnect', socket.id);
      location.replace("https://translate.google.com/?hl=de#en/de/You%20lost...oh%20well.%20Guess%20that%20was%20to%20be%20expected.");
      sleep(1000);
    }

   // NOTE: THIS TOOK ABOUT 6 hrs... NEVER GIVE UP!


    this.barLenght = map(this.hP, 0, 1000, 0, window.innerWidth - 32);

    this.secondBarSpeed += this.hP;

    //this.secondBarSpeed *= map(this.hP, 0, this.sHP, 1, 0.9);  for more time to a just when health os lower
    this.secondBarSpeed *= map(this.hP, 0, this.hP, 1, 0.9);

    //this.secondBarLenght = map(this.secondBarSpeed, 8999, 9999, window.innerWidth - 32, 0);
    this.secondBarLenght = map(this.secondBarSpeed, 8999, 0, window.innerWidth - 32, 0);

    //console.log(this.secondBarSpeed);

    fill('rgba(234, 73, 58, 0.35)');
    noStroke();
    push();
    translate(this.pos.x - window.innerWidth / 2, this.pos.y - window.innerHeight / 2 + 15);
    rect(window.innerWidth / 2 - this.barLenght / 2, 0, this.barLenght, 11);
    fill('rgba(234, 73, 58, 0.2)');
    rect(window.innerWidth / 2 - this.secondBarLenght / 2, 0, this.secondBarLenght, 11);
    pop();
  }

  this.constrain = function () {
    player.pos.x = constrain(player.pos.x, -worldSize.x, worldSize.x);
    player.pos.y = constrain(player.pos.y, -worldSize.y, worldSize.y);
  }

  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }

  this.setRotation = function(a) {
    this.rotation = a;
  }

  this.turn = function() {
    this.heading += this.rotation;
  }
}

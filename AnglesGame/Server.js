var players = [];

var globalObstacles = [];

var playersLasers = [];

var worldSize = {
  x:2000,
  y:2000
}

//making rectangles a global variable
var rectangles = {
  x:0,
  y:0,
  w:0,
  h:0
};

// generation of random rectangle values
for (var i = 0; i < worldSize.x / 22 + worldSize.y / 22; i++) {
  var rectangles = {
    x: Math.floor(Math.random() < 0.5 ? Math.random() * (-worldSize.x + 0) +1 : Math.random() * (0 + worldSize.x) + 1),
    y: Math.floor(Math.random() < 0.5 ? Math.random() * (-worldSize.y + 0) +1 : Math.random() * (0 + worldSize.y) + 1),
    w: Math.floor(Math.random() * (20 + 220) + 1),
    h: Math.floor(Math.random() * (20 + 220) + 1)
  };
  console.log(rectangles);
  globalObstacles.push(rectangles);
}

function Player(id, x, y, head) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.heading = head;
}

var express = require('express');

var app = express();
var server = app.listen(80);

app.use(express.static('public'));

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);

console.log('Hey there');
console.log('youre awesome');

setInterval(heartbeat, 33);
function heartbeat() {
  //send player data
  io.sockets.emit('heatbeat', players);
}

function newConnection(socket) {
  console.log('newConnection: ' + socket.id);

  socket.on('start', start);
  function start(data) {
    console.log(socket.id + " " + data.x + " " + data.y);
    var player = new Player(socket.id, 0, 0);
    //console.log(player);
    players.push(player);

    // generation of random rectangle values
      io.sockets.emit('newRect', globalObstacles);
    //  console.log('hi');
    //  console.log(globalObstacles);
  }
  socket.on('update', update);
  function update(data) {
    //console.log(socket.id + " " + data.x + " " + data.y);
    var player;
    for (var i = 0; i < players.length; i++) {
      if (socket.id == players[i].id) {
        player = players[i];
      }
    }
    player.x = data.x;
    player.y = data.y;
    player.heading = data.head;
  }
  socket.on('shot', shot);
  function shot(playerID) {
    io.sockets.emit('newShot', playerID);
    //console.log('shot');
  }
  socket.on('hitPlayer', dealDamage);
  function dealDamage(laserData) {
    io.sockets.emit('dealDamage', laserData);
  }

  socket.on('disconnect', delPlayer);
  function delPlayer(id) {
    console.log('ahhhh');
    for (var i = 0; i < players.length; i++) {
      var tid = id;
      console.log('array id: ' + players[i].id);
      console.log('sent id: ' + tid)
      if (tid !== players[i].id) {
        players.splice(players[i], 1);
        console.log('disconnect exact player');
      }
    //  players.splice(id, 1);
    }
  }
}

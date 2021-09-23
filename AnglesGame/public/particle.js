function Glow (Hi)  {
  this.pos = createVector(player.pos.x, player.pos.y);
  this.c = color('rgba(253, 177, 94, 0.09)');
  this.ax = 0;

  this.postransform = function() {
	console.log(Hi);
  }

  this.render = function() {
    push();
    translate(player.pos.x, player.r);
    rotate(PI / 2);
	noStroke();
    fill(this.c);
    ellipse(0, 0, 30, 60);
    pop();
  }
}

// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
//modified by John Suckau
/* ===
ml5 Example
PoseNet example using p5.js
=== */

//hi Ben

let video;
let poseNet;
let poses = [];
let img;
//min distance needed for shot..
let minDist = prompt("Min shot distance?");
//min confidence that is needed to fire a sot using a datapoint with the amount of accuracy granted by this confidence..
let minConfidence = prompt("Min shot confidence (<=1)?");

function preload() {
  //img = loadImage('mlgGlasses.png');
}

function setup() {
  if (minDist == null) {
    minDist = 0;
  }
  if (minConfidence == null) {
    minConfidence = 0.2;
  }
  //console.log("minDist: " + minDist);
  //console.log("minConfidence: " + minConfidence);
  //Ball = new ball
  createCanvas(window.innerWidth, window.innerWidth / (640 / 480));

  video = createCapture(VIDEO);
  video.size(width, height);
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  //video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  //background(230);
  drawKeypoints();
  drawSkeleton();
  if (poses.length != 0) {

    //image(img, poses[0].pose.nose.x - 110, ((poses[0].pose.rightEye.y + poses[0].pose.leftEye.y) / 2) - 50, (poses[0].pose.leftEye.x - poses[0].pose.rightEye.x) * window.innerWidth / 200, (poses[0].pose.nose.y - poses[0].pose.rightEye.y) * (window.innerWidth / 200));
    //image(img, poses[0].pose.rightEye.x, poses[0].pose.rightEye.y, (poses[0].pose.rightEye.x - poses[0].pose.leftEye.x) * 3, 30);
    //image(img, poses[0].pose.rightEye.x - window.innerWidth / 7.6, poses[0].pose.rightEye.y - 50, window.innerWidth / 2.5, 100);
    //console.log(poses[0].pose.leftEye.x -poses[0].pose.rightEiu8ye.x)
  }

  /*
  if (poses.length != 0) {
    console.log('recognition')
    console.log(poses[0].pose.leftEye);
  }
  */
}

function windowResized() {
  sizeNew();
}

function sizeNew() {
  resizeCanvas(window.innerWidth, window.innerWidth / (640 / 480));
}
// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2 or minConfidence
      if (keypoint.score > minConfidence) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }

      //for shooting..
      if (keypoint.score > minConfidence && distance(poses[0].pose.rightEar.x, poses[0].pose.rightEar.y, poses[0].pose.leftEar.x, poses[0].pose.leftEar.y) > minDist) {
        console.log(distance(poses[0].pose.rightEar.x, poses[0].pose.rightEar.y, poses[0].pose.leftEar.x, poses[0].pose.leftEar.y));
      }
    }
  }
}
//calculace distance with pythagorean theorem..
function distance(x1, y1, x2, y2) {
  var d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return d
}
// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

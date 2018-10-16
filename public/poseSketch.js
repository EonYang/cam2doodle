// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Real time Object Detection using YOLO and p5.js
=== */

let video;
let status;

let poseNet;
let poses = [];

let graphics = [];

var urlPrefix = './api/getDoodle?word=';

let allDoodleData;

let dataReady = false;
let faceDoodle, handDoodle1, handDoodle2;

function ajaxGetAll() {
    $.ajax({
        url: './api/getAll',
        dataType: 'json',
        success: (data) => {
            allDoodleData = data;
            faceDoodle = allDoodleData.face[0];
            handDoodle1 = allDoodleData.hand[0];
            handDoodle2 = allDoodleData.hand[1];
            dataReady = true;
            console.log(data);
        },
        error: (error) => {
            console.log(error);
        }
    });
}
ajaxGetAll();

function ajaxGetDoodle(word, graphicIndex) {
    $.ajax({
        url: urlPrefix + word,
        dataType: 'json',
        success: (data) => {
            if (data.error) {
                console.log(`no such item ${word}`);
            } else {
                //              drawDoodle(data.doodle.drawing, graphicIndex);
            }
            console.log(data);
        },
        error: (error) => {
            console.log(error);
        }
    });
}

var onlyGraphic;

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(640, 480);
    onlyGraphic = createGraphics(512, 512);

    imageMode(CENTER);

    graphics[0] = createGraphics(512, 512);
    graphics[1] = createGraphics(512, 512);
    graphics[2] = createGraphics(512, 512);
    // Create a YOLO method

    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', function(results) {
        poses = results;
    });

    // Hide the original video
    video.hide();
    status = select('#status');
}

function draw() {
    translate(width, 0); // move to far corner
    scale(-1.0, 1.0);
    //image(video, 0, 0, width, height);
    background(200);
    drawKeypoints();
    drawSkeleton();
    let leftEar, rightEar, nose, leftHand, rightHand;
    let faceXywh = [];
    if (poses.dataType != 'undefined') {
        poses.forEach((value) => {
            value.pose.keypoints.forEach((point) => {
                if (point.part == "nose") {
                    nose = point.position;
                } else if (point.part == "leftEar") {
                    leftEar = point.position;
                } else if (point.part == "rightEar") {
                    rightEar = point.position;
                } else if (point.part == "leftWrist") {
                    leftHand = point.position;
                } else if (point.part == "rightWrist") {
                    rightHand = point.position;
                }
            });
        });
    }
    if (dataReady) {
        if (nose != null && leftEar != null && rightEar != null) {

            faceXywh = [nose.x, nose.y, leftEar.x - rightEar.x, leftEar.x - rightEar.x];
            graphics[0].clear();
            if (frameCount % 30 == 0) {
                faceDoodle = allDoodleData.face[floor(random(10))];
            }
            faceDoodle.drawing.forEach(
                (line) => {

                    graphics[0].beginShape();
                    line[0].forEach(function(value, index) {
                        graphics[0].curveVertex(value, line[1][index]);
                    });
                    graphics[0].endShape();
                });
            image(graphics[0], faceXywh[0], faceXywh[1], faceXywh[2], faceXywh[3]);
        }
        if (leftHand != null) {
            graphics[1].clear();
            if (frameCount % 30 == 0) {
                handDoodle1 = allDoodleData.hand[floor(random(10))];
            }
            handDoodle1.drawing.forEach(
                (line) => {

                    graphics[1].beginShape();
                    line[0].forEach(function(value, index) {
                        graphics[1].curveVertex(value, line[1][index]);
                    });
                    graphics[1].endShape();
                });
            image(graphics[1], leftHand.x, leftHand.y, faceXywh[2] / 1.5, faceXywh[3] / 1.5);
        }
        if (rightHand != null) {
            graphics[2].clear();
            if (frameCount % 30 == 0) {
                handDoodle2 = allDoodleData.hand[floor(random(10))];
            }
            handDoodle2.drawing.forEach(
                (line) => {

                    graphics[2].beginShape();
                    line[0].forEach(function(value, index) {
                        graphics[2].curveVertex(value, line[1][index]);
                    });
                    graphics[2].endShape();
                });
            image(graphics[2], rightHand.x, rightHand.y, faceXywh[2] / 1.5, faceXywh[3] / 1.5);
        }
    }
    //    for (let i = 0; i < objects.length; i++) {
    //        let g = onlyGraphic;
    //        let word = objects[i].className;
    //        let xywh = [objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height];
    //        noStroke();
    //        fill(0);
    //        text(objects[i].className, objects[i].x * width, objects[i].y * height - 5);
    //        //noFill();
    //        //strokeWeight(4);
    //        //stroke(0, 255, 0);
    //        //rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
    //        g.strokeWeight(8);
    //        g.stroke(0);
    //        g.noFill();
    //        //ajaxGetDoodle(objects[i].className, i);
    //
    //
    //        if (!allDoodleData.hasOwnProperty(word)) {
    //            console.log(`no such item ${word}`);
    //        } else {
    //            g.clear();
    //            allDoodleData[word][floor(random(10))].drawing.forEach(
    //                (line) => {
    //                    g.beginShape();
    //                    line[0].forEach(function(value, index) {
    //                        g.curveVertex(value, line[1][index]);
    //                    });
    //                    g.endShape();
    //                });
    //            image(g, xywh[0], xywh[1], xywh[2], xywh[3]);
    //            console.log(`drawing ${word} on canvas ${i}`);
    //        }
    //    }
}

function modelReady() {
    select('#status').html('Model Loaded');
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
    }
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

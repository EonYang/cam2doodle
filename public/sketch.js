// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Real time Object Detection using YOLO and p5.js
=== */

let video;
let yolo;
let status;
let objects = [];

let graphics = [];

var urlPrefix = './api/getDoodle?word=';

let allDoodleData;

function ajaxGetAll() {
    $.ajax({
        url: './api/getAll',
        dataType: 'json',
        success: (data) => {
            allDoodleData = data;
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


function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(640, 480);

    graphics[0] = createGraphics(512, 512);
    graphics[1] = createGraphics(512, 512);
    graphics[2] = createGraphics(512, 512);
    // Create a YOLO method
    yolo = ml5.YOLO(video, startDetecting);

    // Hide the original video
    video.hide();
    status = select('#status');
}

function draw() {
    translate(width, 0); // move to far corner
    scale(-1.0, 1.0)
    //image(video, 0, 0, width, height);
    background(200);
    for (let i = 0; i < objects.length; i++) {
        let word = objects[i].className;
        let xywh = [objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height];
        noStroke();
        fill(0);
        text(objects[i].className, objects[i].x * width, objects[i].y * height - 5);
        //noFill();
        //strokeWeight(4);
        //stroke(0, 255, 0);
        //rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
        graphics[i].strokeWeight(8);
        graphics[i].stroke(0);
        //ajaxGetDoodle(objects[i].className, i);


        if (!allDoodleData.hasOwnProperty(word)) {
            console.log(`no such item ${word}`);
        } else {
            graphics[i].clear();
            allDoodleData[word][floor(random(10))].drawing.forEach(
                function(line) {
				graphics[i].noFill();
                    graphics[i].beginShape();
                    line[0].forEach(function(value, index) {
                        graphics[i].curveVertex(value, line[1][index]);
                    })
                    graphics[i].endShape();
                });
            image(graphics[i], xywh[0], xywh[1], xywh[2], xywh[3]);
            console.log(`drawing ${word} on canvas ${i}`);
        }
    }
}

function startDetecting() {
    status.html('Model loaded!');
    detect();
}

function detect() {
    yolo.detect(function(err, results) {
        objects = results;
        detect();
    });
}

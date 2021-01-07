"use strict";

let canvas;
let context;

window.onload = init;

function init() {
    // Get a reference to the canvas
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 200;
let fps;

let rectX = 0;
let rectY = 0;

function gameLoop(timeStamp) {
    // Calculate how much time has passed
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Move forward in time with a maximum amount
    secondsPassed = Math.min(secondsPassed, 0.1);

    // Update game objects in the loop
    update(secondsPassed);
    draw();

    // Calculate the number of seconds passed since the last frame
    fps = Math.round(1 / secondsPassed);
    context.font = '18px Arial';
    context.fillStyle = 'orange';
    context.fillText("FPS: " + fps, 10, 20);

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

document.onkeydown = function(e) {
    // Check if a key is curently held down
    if(e.key === 'a') leftPressed = true;
    if(e.key === 'd') rightPressed = true;
    if(e.key === 'w') upPressed = true;
    if(e.key === 's') downPressed = true;
}

document.onkeyup = function(e) {
    // Check if a key is not held down
    if(e.key === 'a') leftPressed = false;
    if(e.key === 'd') rightPressed = false;
    if(e.key === 'w') upPressed = false;
    if(e.key === 's') downPressed = false;    
}

function update(secondsPassed) {
    // Use time to calculate new position
    if (leftPressed) {rectX -= (movingSpeed * secondsPassed);}
    if (rightPressed) {rectX += (movingSpeed * secondsPassed);}
    if (upPressed) {rectY -= (movingSpeed * secondsPassed);}
    if (downPressed) {rectY += (movingSpeed * secondsPassed);}
}

function draw() {
    // Clear the entire canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    //let randomColor = Math.random() >0.5? '#ff8080' : '#0099b0';
    context.fillStyle = '#ff8080';
    context.fillRect(rectX, rectY, 100, 25);
}
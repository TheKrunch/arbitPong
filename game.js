"use strict";

let canvas;
let context;
let secondsPassed = 0;
let oldTimeStamp = 0;
let gameObjects;
let requestID;

window.onload = init;

function init() {
    // Get a reference to the canvas
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    
    createWorld(); // from scripts.js

    // Start the first frame request
    requestID = window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    // Calculate how much time has passed
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    // Move forward in time with a maximum amount
    secondsPassed = Math.min(secondsPassed, 0.1);

    clearCanvas(); // from scripts.js

    updateAndDrawObjects(); // from scripts.js
    
    showFPS(); // from scripts.js

    // Keep requesting new frames
    requestID = window.requestAnimationFrame(gameLoop);
}
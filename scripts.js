// GLOBAL VARIABLES
let fps;
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var upHeld = false;
var downHeld = false;
var selectedBall = null;
var score = 0;

// WORLD/CANVAS
function createWorld() {
    gameObjects = [
        // new Paddle(context, 220, 150, 0, 0, 100, 25, 200, Math.PI * 2.0),
        new Paddle(context, 300, 350, 0, 0, 100, 25, 200, 0),
        new Wall(context, 0, 0, 0, 0, 750, 3, 0, 0),
        new Wall(context, 0, 397, 0, 0, 750, 3, 0, 0),
        new Wall(context, 0, 0, 0, 0, 3, 400, 0, 0),
        new Wall(context, 747, 0, 0, 0, 3, 400, 0, 0),
        new Ball(context, 400, 250, 0, -1, 11),
        new Ball(context, 725, 50, -25, 25, 11),
        new Ball(context, 420, 69, -15, 5, 11),
        new Ball(context, 25, 25, 25, 25, 15)
    ];
}

function setupCanvas() {
    canvas = document.getElementById('canvas');
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    context = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    context.scale(dpr, dpr);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function showFPS() {
    // Calculate the number of seconds passed since the last frame
    fps = Math.round(1 / secondsPassed);
    context.font = '18px Arial';
    context.textAlign = "left";
    context.fillStyle = 'orange';
    context.fillText("FPS: " + fps, 10, 20);
}

function showScore() {
    context.font = '50px Impact';
    context.fillStyle = 'black';
    context.textAlign = "center";
    context.fillText("Score: " + score, 375, 50);
}

function updateAndDrawObjects() {
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(secondsPassed);
        detectCollisions();
        gameObjects[i].draw();
    }
}

// INPUT DETECTION
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
    if(e.key === 'w') {
        upPressed = false;
        upHeld = false;
    }
    if(e.key === 's') {
        downPressed = false;
        downHeld = false;
    }
}

canvas.onmousedown = function(e) {
    for (let i = 0; i < gameObjects.length; i++) {
        if (gameObjects[i] instanceof Ball) {
            if (pointBallIntersect(e.offsetX, e.offsetY, gameObjects[i])) {
                selectedBall = gameObjects[i];
                break;
            }
        }
    }
}

canvas.onmousemove = function(e) {
    if (selectedBall) {
        selectedBall.x = e.offsetX;
        selectedBall.y = e.offsetY;
    }
}

canvas.onmouseup = function(e) {
    selectedBall = null;
}

// COLLISIONS & INTERSECTIONS
function detectCollisions() {
    let obj1;
    let obj2;

    // Reset collision state of all objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < gameObjects.length; i++)
    {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++)
        {
            obj2 = gameObjects[j];

            // Compare obj1 with obj2
            intersect(obj1, obj2);  
        }
    }
}

// Cross fingers and pray
function intersect(o1, o2) {
    if (o1 instanceof Ball && o2 instanceof Ball)
        if (ballBallIntersect(o1,o2)) {
            o1.isColliding = true;
            o2.isColliding = true;
        }

    if (o1 instanceof Ball && (o2 instanceof Rectangle))
        if (smartyBallRectIntersect(o1,o2)) {
            o1.isColliding = true;
            o2.isColliding = true;
        }

    if (o2 instanceof Ball && (o1 instanceof Rectangle))
        if (smartyBallRectIntersect(o2,o1)) {
            o1.isColliding = true;
            o2.isColliding = true;
        }

    return false
}

// Thank: https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
function smartyBallRectIntersect(ball, rect) {
    return (pointInRectangle(ball, rect) ||

        intersectBall(ball, {p1: rect.A, p2: rect.B}) ||
        intersectBall(ball, {p1: rect.B, p2: rect.C}) ||
        intersectBall(ball, {p1: rect.C, p2: rect.D}) ||
        intersectBall(ball, {p1: rect.D, p2: rect.A}))
}

function ballBallIntersect(ball1, ball2) {
    // Calculate the distance between the two balls
    let squareDist = (ball1.x - ball2.x) * (ball1.x - ball2.x) + (ball1.y - ball2.y) * (ball1.y - ball2.y)

    // When the distance is smaller or equal to the sum
    // of the two radiuses, the circles touch or overlap
    return squareDist <= ((ball1.r + ball2.r) * (ball1.r + ball2.r)) // This will change to if statement that calls ballBounce()
}

function pointBallIntersect(x, y, ball) {
    let squareDist = (ball.x - x) * (ball.x - x) + (ball.y - y) * (ball.y - y)

    return squareDist <= (ball.r * ball.r)
}

// Crazy vectors and stuff
function pointInRectangle(point, r) {
    var AB = vector(edge(r.A, r.B));
    var AM = vector(edge(r.A, point));
    var BC = vector(edge(r.B, r.C));
    var BM = vector(edge(r.B, point));
    var dotABAM = dot(AB, AM);
    var dotABAB = dot(AB, AB);
    var dotBCBM = dot(BC, BM);
    var dotBCBC = dot(BC, BC);
    return 0 <= dotABAM && dotABAM <= dotABAB && 0 <= dotBCBM && dotBCBM <= dotBCBC;
}

function intersectBall(ball, edge) {
    // Thank: https://mathworld.wolfram.com/Circle-LineIntersection.html
    let dx = edge.p1.x - edge.p2.x;
    let dy = edge.p1.y - edge.p2.y;
    let dr = Math.sqrt((dx * dx) + (dy * dy));
    let bigD = (edge.p1.x - ball.x) * (edge.p2.y - ball.y) - (edge.p1.y - ball.y) * (edge.p2.x - ball.x);
    
    // Find the closest point to the circle witin the rectangle
    let closestX = clamp(ball.x, edge.p1.x, edge.p2.x);
    let closestY = clamp(ball.y, edge.p1.y, edge.p2.y);

    // Calculate the distance between the circle's center and the closest point
    let distanceX = ball.x - closestX;
    let distanceY = ball.y - closestY;
    let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

    // Check if ball is further than a radius away from the closest point
    if (distanceSquared > (ball.r * ball.r)) {
        return false
    }
    
    if (0 <= (ball.r * ball.r) * (dr * dr) - (bigD * bigD))
        return edgeBounce(ball, edge);
    else
        return false;
    // TODO: Change this to an if statement that calls edgeBounce()
}

// Changes the balls vx and vy to bounce off an edge
// https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
// r = d - 2(d ⋅ n) * n
function edgeBounce(ball, edge) {
    // vector of ball (d)
    let vBall = vector(ball);

    // normalized edge vector (b - from the graph)
    let normVec = normalize(vector(edge));
    // perpendicular vector to edge (n)
    let perpVec = {x: -normVec.y, y: normVec.x};
    // This is 2(d ⋅ n)
    let scalar = dot(vBall, perpVec) * 2;
    // This is 2(d ⋅ n) * n
    let subtrahend = {x: perpVec.x * scalar, y: perpVec.y * scalar};

    let bounceVec = {x: vBall.x - subtrahend.x, y: vBall.y - subtrahend.y};
    
    ball.vx = bounceVec.x;
    ball.vy = bounceVec.y;

    score++;
    return true;
}

function ballBounce(ball1, ball2) {
    // CODE GOES HERE
}

// HELPER FUNCTIONS
// Take an edge and return the vector, if its a ball use the balls vx and vy
function vector(edge) {
    if (edge instanceof Ball)
        return {x: edge.vx, y: edge.vy}
    return {x: edge.p2.x - edge.p1.x, y: edge.p2.y - edge.p1.y}
}

// Take two points and format them into an edge
function edge(point1, point2) {
    return {p1: point1, p2: point2}
}

// Take two vectors and return the dot product
function dot(u, v) {
    return u.x * v.x + u.y * v.y;
}

// Returns the magnitude of a vector
function mag(vec) {
    return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y))
}

// Returns the given vector normalized
function normalize(vec) {
    let vMag = mag(vec);
    return {x: vec.x / vMag, y: vec.y / vMag}
}

// Clamp the num between the min and the max
function clamp(num, min, max) {
    if (min > max) {
        return num <= max ? max : num >= min ? min : num;
    }
    return num <= min ? min : num >= max ? max : num;
}
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
        new Ball(context, 400, 250, 50, 0, 11),
        new Ball(context, 500, 251, -50, 50, 11),
        new Ball(context, 420, 69, -50, 50, 11),
        new Ball(context, 300, 220, 50, 0, 11),
        new Ball(context, 500, 100, -50, 50, 11),
        new Ball(context, 410, 40, -50, 50, 11),
        new Ball(context, 100, 25, 50, 50, 15)
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
        ballCornerIntersect(ball, rect) ||
        intersectBall(ball, {p1: rect.A, p2: rect.B}) ||
        intersectBall(ball, {p1: rect.B, p2: rect.C}) ||
        intersectBall(ball, {p1: rect.C, p2: rect.D}) ||
        intersectBall(ball, {p1: rect.D, p2: rect.A}))
}

function ballBallIntersect(ball1, ball2) {
    // Calculate the distance between the two balls
    let squareDist = (ball1.x - ball2.x) * (ball1.x - ball2.x) + (ball1.y - ball2.y) * (ball1.y - ball2.y);

    // When the distance is smaller or equal to the sum
    // of the two radiuses, the circles touch or overlap
    if (squareDist <= ((ball1.r + ball2.r) * (ball1.r + ball2.r))) {
        ballBounce(ball1, ball2);
        return true;
    }
}

function ballCornerIntersect(ball, rect) {
    if (pointBallIntersect(rect.A.x, rect.A.y, ball)) {
        let edgeVec = normalize(vector(edge(rect.A, rect.B)));
        let ballVec = normalize(vector(edge(rect.A, ball)));

        if (Math.PI * 0.6 < Math.acos(dot(edgeVec, ballVec))) {
            return edgeBounce(ball, edge(rect.D, rect.A));
        }
        else {
            return edgeBounce(ball, edge(rect.A, rect.B));
        }
    }

    else if (pointBallIntersect(rect.B.x, rect.B.y, ball)) {
        let edgeVec = normalize(vector(edge(rect.B, rect.C)));
        let ballVec = normalize(vector(edge(rect.B, ball)));

        if (Math.PI * 0.6 < Math.acos(dot(edgeVec, ballVec))) {
            return edgeBounce(ball, edge(rect.A, rect.B));
        }
        else {
            return edgeBounce(ball, edge(rect.B, rect.C));
        }
    }
    else if (pointBallIntersect(rect.C.x, rect.C.y, ball)) {
        let edgeVec = normalize(vector(edge(rect.C, rect.D)));
        let ballVec = normalize(vector(edge(rect.C, ball)));

        if (Math.PI * 0.6 < Math.acos(dot(edgeVec, ballVec))) {
            return edgeBounce(ball, edge(rect.B, rect.C));
        }
        else {
            return edgeBounce(ball, edge(rect.C, rect.D));
        }
    }
    else if (pointBallIntersect(rect.D.x, rect.D.y, ball)) {
        let edgeVec = normalize(vector(edge(rect.D, rect.A)));
        let ballVec = normalize(vector(edge(rect.D, ball)));

        if (Math.PI * 0.6 < Math.acos(dot(edgeVec, ballVec))) {
            return edgeBounce(ball, edge(rect.C, rect.D));
        }
        else {
            return edgeBounce(ball, edge(rect.D, rect.A));
        }
    }
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
    
    // Find the closest point to the circle on the edge
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
    
    if (0 <= (ball.r * ball.r) * (dr * dr) - (bigD * bigD)) {
        edgeBounce(ball, edge);
        return true;
    }
    else {
        return false;
    }
}

// Stop balls from intersecting with eachother
// Displaces two balls by the amount they overlap
function ballBallDisplace(ball1, ball2) {
    // Distance between ball centers
    let dist = Math.sqrt((ball1.x - ball2.x) * (ball1.x - ball2.x) + (ball1.y - ball2.y) * (ball1.y - ball2.y));
    let overlap = 0.5 * (dist - ball1.r - ball2.r);

    // Displace ball1
    ball1.x -= overlap * (ball1.x - ball2.x) / dist;
    ball1.y -= overlap * (ball1.y - ball2.y) / dist;
    // Displace ball2
    ball2.x += overlap * (ball1.x - ball2.x) / dist;
    ball2.y += overlap * (ball1.y - ball2.y) / dist;
}

// Thank: https://www.youtube.com/watch?v=ebq7L2Wtbl4
// TODO: Some of the math here is redundent with intersectBall()...
// could possibly refactor this into intersectBall()
function ballEdgeDisplace(ball, edge) {
    let lineX1 = edge.p2.x - edge.p1.x;
    let lineY1 = edge.p2.y - edge.p1.y;

    let lineX2 = ball.x - edge.p1.x;
    let lineY2 = ball.y - edge.p1.y;

    let edgeLength = lineX1 * lineX1 + lineY1 * lineY1;

    let t = Math.max(0, Math.min(edgeLength, (lineX1 * lineX2 + lineY1 * lineY2))) / edgeLength;

    let closestPointX = edge.p1.x + t * lineX1;
    let closestPointY = edge.p1.y + t * lineY1;

    let dist = Math.sqrt((ball.x - closestPointX) * (ball.x - closestPointX) + (ball.y - closestPointY) * (ball.y - closestPointY));

    let overlap = 1 * (dist - ball.r - 0.01); // The .01 seems to help fix clipping issues

    // Displace ball
    ball.x -= overlap * (ball.x - closestPointX) / dist;
    ball.y -= overlap * (ball.y - closestPointY) / dist;
}

// Changes the balls vx and vy to bounce off an edge
// Thank: https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
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
    ballEdgeDisplace(ball, edge);
    return true;
}

// Changes both balls vx and vy to bounce off eachother
function ballBounce(ball1, ball2) {
    let tempVX = ball1.vx;
    let tempVY = ball1.vy;

    ball1.vx = ball2.vx;
    ball1.vy = ball2.vy;

    ball2.vx = tempVX;
    ball2.vy = tempVY;
    ballBallDisplace(ball1, ball2);
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

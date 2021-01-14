let fps;
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var selectedBall = null;

function createWorld() {
    gameObjects = [
        new Paddle(context, 250, 300, 0, 0, 100, 25, 200, Math.PI * 0.25),
        new Paddle(context, 400, 300, 0, 0, 100, 25, 200, 0),
        new Wall(context, 55, 100, 0, 0, 15, 250, 0, Math.PI * 0.25),
        new Wall(context, 550, 50, 0, 0, 15, 250, 0, 0),
        new Ball(context, 185, 200, 100, 0, 12.5),
        new Ball(context, 500, 200, -100, 0, 20),
        new Ball(context, 600, 200, -20, 20, 12.5),
        new Ball(context, 400, 250, 0, 0, 11)
    ];
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function showFPS() {
    // Calculate the number of seconds passed since the last frame
    fps = Math.round(1 / secondsPassed);
    context.font = '18px Arial';
    context.fillStyle = 'orange';
    context.fillText("FPS: " + fps, 10, 20);
}

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

function updateAndDrawObjects() {
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(secondsPassed);
        detectCollisions();
        gameObjects[i].draw();
    }
}

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
            if (intersect(obj1, obj2)) {
                obj1.isColliding = true;
                obj2.isColliding = true;

                if (obj1 instanceof Ball && (obj2 instanceof Wall || obj2 instanceof Paddle)) {
                    // Find the perpendicular vector of the edge
                    let closestX = clamp(obj1.x, obj1.x, obj1.x + obj1.w);
                    let closestY = clamp(obj1.y, obj1.y, obj1.y + obj1.h);

                    // Find the magnitude and normalize -_-
                    let vMag = Math.sqrt((x * x) + (y * y));
                    let vNorm = {x: obj1.x / vMag, y: obj1.y / vMag};

                }
                
                
                
            }
        }
    }
}

// Cross fingers and pray
function intersect(o1, o2) {
    if (o1 instanceof Ball && o2 instanceof Ball)
        return ballBallIntersect(o1,o2)

    if (o1 instanceof Ball && (o2 instanceof Paddle || o2 instanceof Wall))
        return smartyBallRectIntersect(o1,o2)

    if (o2 instanceof Ball && (o1 instanceof Paddle || o1 instanceof Wall))
        return smartyBallRectIntersect(o2,o1)

    return false
}

function ballBallIntersect(ball1, ball2) {
    // Calculate the distance between the two balls
    let squareDist = (ball1.x - ball2.x) * (ball1.x - ball2.x) + (ball1.y - ball2.y) * (ball1.y - ball2.y)

    // When the distance is smaller or equal to the sum
    // of the two radiuses, the circles touch or overlap
    return squareDist <= ((ball1.r + ball2.r) * (ball1.r + ball2.r))
}

function pointBallIntersect(x, y, ball) {
    let squareDist = (ball.x - x) * (ball.x - x) + (ball.y - y) * (ball.y - y)

    return squareDist <= (ball.r * ball.r)
}

// Crazy vectors and stuff
function pointInRectangle(point, r) {
    var AB = vector(r.A, r.B);
    var AM = vector(r.A, point);
    var BC = vector(r.B, r.C);
    var BM = vector(r.B, point);
    var dotABAM = dot(AB, AM);
    var dotABAB = dot(AB, AB);
    var dotBCBM = dot(BC, BM);
    var dotBCBC = dot(BC, BC);
    return 0 <= dotABAM && dotABAM <= dotABAB && 0 <= dotBCBM && dotBCBM <= dotBCBC;
}

function vector(p1, p2) {
    return {x: (p2.x - p1.x), y: (p2.y - p1.y)};
}

function dot(u, v) {
    return u.x * v.x + u.y * v.y; 
}

function intersectBall(ball, edge) {
    // Thank: https://mathworld.wolfram.com/Circle-LineIntersection.html
    let dx = edge.A.x - edge.B.x;
    let dy = edge.A.y - edge.B.y;
    let dr = Math.sqrt((dx * dx) + (dy * dy));
    let bigD = (edge.A.x - ball.x) * (edge.B.y - ball.y) - (edge.A.y - ball.y) * (edge.B.x - ball.x);
    
    // Find the closest point to the circle witin the rectangle
    let closestX = clamp(ball.x, edge.A.x, edge.B.x);
    let closestY = clamp(ball.y, edge.A.y, edge.B.y);

    // Calculate the distance between the circle's center and the closest point
    let distanceX = ball.x - closestX;
    let distanceY = ball.y - closestY;
    let distanceSquared  = (distanceX * distanceX) + (distanceY * distanceY);

    // Check if ball is further than a radius away from the closest point
    if (distanceSquared > (ball.r * ball.r)) {
        return false
    }
    return 0 <= (ball.r * ball.r) * (dr * dr) - (bigD * bigD);
}

function clamp(num, min, max) {
    if (min > max) {
        return num <= max ? max : num >= min ? min : num;
    }

    return num <= min ? min : num >= max ? max : num;
}

// Thank: https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
function smartyBallRectIntersect(ball, rect) {
    return (pointInRectangle(ball, rect) || 
        intersectBall(ball, {A: {x: rect.A.x, y: rect.A.y}, B: {x: rect.B.x, y: rect.B.y}}) ||
        intersectBall(ball, {A: {x: rect.B.x, y: rect.B.y}, B: {x: rect.C.x, y: rect.C.y}}) ||
        intersectBall(ball, {A: {x: rect.C.x, y: rect.C.y}, B: {x: rect.D.x, y: rect.D.y}}) ||
        intersectBall(ball, {A: {x: rect.D.x, y: rect.D.y}, B: {x: rect.A.x, y: rect.A.y}}))
}
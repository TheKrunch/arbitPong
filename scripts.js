let fps;
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

function createWorld() {
    gameObjects = [
        new Paddle(context, 250, 300, 200, 200),
        new Wall(context, 120, 100, 0, 0),
        new Wall(context, 520, 50, 0, 0),
        new Ball(context, 185, 200, 100, 0),
        new Ball(context, 500, 200, -100, 0)
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
            if (intersect(obj1, obj2)){
                obj1.isColliding = true;
                obj2.isColliding = true;
            }
        }
    }
}

function intersect(o1, o2) {
    if (o1 instanceof Ball && o2 instanceof Ball)
        return ballBallIntersect(o1,o2)

    if (o1 instanceof Ball && (o2 instanceof Paddle || o2 instanceof Wall))
        return ballRectBetterIntersect(o1,o2)

    if (o2 instanceof Ball && (o1 instanceof Paddle || o1 instanceof Wall))
        return ballRectBetterIntersect(o2,o1)
}


function ballBallIntersect(ball1, ball2) {
    // Calculate the distance between the two balls
    let squareDist = (ball1.x - ball2.x) * (ball1.x - ball2.x) + (ball1.y - ball2.y) * (ball1.y - ball2.y)

    // When the distance is smaller or equal to the sum
    // of the two radiuses, the circles touch or overlap
    return squareDist <= ((Ball.radius + Ball.radius) * (Ball.radius + Ball.radius))
}

function ballRectBetterIntersect(ball, rect) {
    let rectWidth = 0;
    let rectHeight = 0;

    if (rect instanceof Paddle) {
        rectWidth = Paddle.width;
        rectHeight = Paddle.height;
    }
    else {
        rectWidth = Wall.width;
        rectHeight = Wall.height;
    }

    // Find the closest point to the circle witin the rectangle
    let closestX = clamp(ball.x, rect.x, rect.x + rectWidth);
    let closestY = clamp(ball.y, rect.y, rect.y + rectHeight);

    // Calculate the distance between the circle's center and this closest point
    let distanceX = ball.x - closestX;
    let distanceY = ball.y - closestY;

    // If the distance is less than the circle's radius, and intersection occurs
    let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared <= (Ball.radius * Ball.radius);
}

function clamp(num, min, max) {
    if (min > max) throw new RangeError('`min` should be lower than `max`');

    return num <= min ? min : num >= max ? max : num;
}
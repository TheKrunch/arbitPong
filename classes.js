class GameObject
{
    constructor (context, x, y, vx, vy) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.isColliding = false;
    }
}

class Paddle extends GameObject
{
    // Set default width and height
    static width = 100;
    static height = 25;

    constructor (context, x, y, vx, vy) {
        super(context, x, y, vx, vy);
    }

    draw(){
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        this.context.fillRect(this.x, this.y, Paddle.width, Paddle.height);
    }

    update(secondsPassed) {
        // Move with set velocity
        if (leftPressed) {this.x -= (this.vx * secondsPassed);}
        if (rightPressed) {this.x += (this.vx * secondsPassed);}
        if (upPressed) {this.y -= (this.vy * secondsPassed);}
        if (downPressed) {this.y += (this.vy * secondsPassed);}
    }
}

class Wall extends GameObject
{
    static width = 15;
    static height = 200;

    constructor (context, x, y, vx, vy) {
        super(context, x, y, vx, vy);
    }

    draw(){
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        this.context.fillRect(this.x, this.y, Wall.width, Wall.height);
    }

    update(secondsPassed) {
        // Don't move
    }
}

class Ball extends GameObject
{
    // Set default radius
    static radius = 12.5;

    constructor (context, x, y, vx, vy) {
        super(context, x, y, vx, vy);
    }

    draw(){
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        this.context.beginPath();
        this.context.arc(this.x, this.y, Ball.radius, 0, 2 * Math.PI);
        this.context.fill();
    }

    update(secondsPassed) {
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}
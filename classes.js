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

class Rectangle extends GameObject
{
    constructor (context, x, y, vx, vy, width, height, speed, angle) {
        super(context, x, y, vx, vy);
        this.w = width;
        this.h = height;
        this.s = speed;
        this.ang = angle;
        // These are the points on the rectangle, they defined in update()
        this.A = {x: 0, y: 0};
        this.B = {x: 0, y: 0};
        this.C = {x: 0, y: 0};
        this.D = {x: 0, y: 0};
    } 

    draw(child) {
        child.context.fillStyle = child.isColliding ? '#ff8080' : '#0099b0';
        child.context.beginPath()
        child.context.moveTo(child.A.x, child.A.y);
        child.context.lineTo(child.B.x, child.B.y);
        child.context.stroke();
        child.context.lineTo(child.C.x, child.C.y);
        child.context.lineTo(child.D.x, child.D.y);
        child.context.fill();
        // this.context.fillText('A', this.A.x, this.A.y);
        // this.context.fillText('B', this.B.x, this.B.y);
        // this.context.fillText('C', this.C.x, this.C.y);
        // this.context.fillText('D', this.D.x, this.D.y);
    }

    update(child) {
        child.A = {x: child.x, y: child.y};
        if (Math.sin(child.ang) == 0) {
            child.B = {x: child.x + child.w, y: child.y};
            child.C = {x: child.x + child.w, y: child.y + child.h};
            child.D = {x: child.x, y: child.y + child.h};
        }
        else if (Math.abs(Math.sin(child.ang)) < 1) {
            child.B = {x: child.x + (child.w / Math.sin((90 * Math.PI / 180)) * Math.sin((90 * Math.PI / 180) - child.ang)), y: child.y - (child.w / Math.sin((90 * Math.PI / 180)) * Math.sin(child.ang))};
            child.C = {x: child.B.x + (child.h / Math.sin((90 * Math.PI / 180)) * Math.sin(child.ang)), y: child.B.y + (child.h / Math.sin((90 * Math.PI / 180)) * Math.sin((90 * Math.PI / 180) - child.ang))};
            child.D = {x: child.x + (child.h / Math.sin((90 * Math.PI / 180)) * Math.sin(child.ang)), y: child.y + (child.h / Math.sin((90 * Math.PI / 180)) * Math.sin((90 * Math.PI / 180) - child.ang))};
        }
        else if (Math.abs(Math.sin(child.ang)) == 1) {
            child.B = {x: child.x, y: child.y - child.w};
            child.C = {x: child.x + child.h, y: child.y - child.w};
            child.D = {x: child.x + child.h, y: child.y};
        }
    }
}

class Paddle extends Rectangle
{
    constructor (context, x, y, vx, vy, width, height, speed, angle) {
        super(context, x, y, vx, vy, width, height, speed, angle);
    }

    draw(){
        Rectangle.prototype.draw(this);
    }

    update(secondsPassed) {
        // Move with set velocity
        if (leftPressed) {
            this.vx = this.s;
        }
        else if (rightPressed) {
            this.vx = -this.s;
        }
        else {
            this.vx = 0;
        }
        if (upPressed) {
            this.vy = this.s;
        }
        else if (downPressed) {
            this.vy = -this.s;
        }
        else {
            this.vy = 0;
        }
        this.x -= (this.vx * secondsPassed);
        this.y -= (this.vy * secondsPassed);
        Rectangle.prototype.update(this);
    }
}

class Wall extends Rectangle
{
    constructor (context, x, y, vx, vy, width, height, speed, angle) {
        super(context, x, y, vx, vy, width, height, speed, angle);
    }

    draw(){
        Rectangle.prototype.draw(this);
    }

    update(secondsPassed) {
        // Don't move
        Rectangle.prototype.update(this);
    }
}

class Ball extends GameObject
{
    constructor (context, x, y, vx, vy, radius) {
        super(context, x, y, vx, vy);
        this.r = radius;
    }

    draw(){
        this.context.save();
        this.context.strokeStyle = 'white';
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.context.fill();
        // Drawing vector
        this.context.translate(this.x, this.y);
        this.context.rotate(Math.atan2(this.vy, this.vx));
        this.context.beginPath();
        this.context.moveTo(0,0);
        this.context.lineTo(this.r, 0);
        this.context.stroke();
        this.context.restore();
    }

    update(secondsPassed) {
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}
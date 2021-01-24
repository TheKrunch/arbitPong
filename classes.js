class GameObject
{
    constructor (context, x, y, vx, vy) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.isColliding = false;
        this.colorList = ['#00ffff', '#00CED1', '#0000FF', '#000080', '#EE82EE', '#FF00FF', '#4B0082',  '#FFFFFF', '#C0C0C0', '#808080', '#000000', '#FF0000', '#800000', '#FF4500', '#FFFF00', '#00FF00', '#006400'];
        this.colorIndex = 1;
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
        this.A = {x: this.x, y: this.y};
        this.B = {x: this.x + this.w, y: this.y};
        this.C = {x: this.x + this.w, y: this.y + this.h};
        this.D = {x: this.x, y: this.y + this.h};
    } 

    draw(child) {
        child.context.fillStyle = child.isColliding ? '#ff8080' : child.colorList[child.colorIndex];
        child.context.beginPath()
        child.context.moveTo(child.A.x, child.A.y);
        child.context.lineTo(child.B.x, child.B.y);
        //child.context.stroke();
        child.context.lineTo(child.C.x, child.C.y);
        child.context.lineTo(child.D.x, child.D.y);
        child.context.fill();
        // child.context.fillText('A', child.A.x, child.A.y);
        // child.context.fillText('B', child.B.x, child.B.y);
        // child.context.fillText('C', child.C.x, child.C.y);
        // child.context.fillText('D', child.D.x, child.D.y);
    }

    update(child) {
        child.A = {x: child.x, y: child.y};
        //console.log(Math.sin(Math.PI));
        if (0 < child.ang && child.ang < (Math.PI * 0.5)) { // Quadrant 1
            child.B = {x: child.x + child.w * Math.cos(child.ang), y: child.y - child.w * Math.sin(child.ang)};
            child.C = {x: child.B.x + child.h * Math.sin(child.ang), y: child.B.y + child.h * Math.cos(child.ang)};
            child.D = {x: child.C.x - child.w * Math.cos(child.ang), y: child.C.y + child.w * Math.sin(child.ang)};
        }

        else if (1 < child.ang && child.ang < Math.PI) { // Quadrant 2
            let shiftAng = child.ang - (Math.PI * 0.5);
            child.B = {x: child.x - child.w * Math.sin(shiftAng), y: child.y - child.w * Math.cos(shiftAng)};
            child.C = {x: child.B.x + child.h * Math.cos(shiftAng), y: child.B.y - child.h * Math.sin(shiftAng)};
            child.D = {x: child.C.x + child.w * Math.sin(shiftAng), y: child.C.y + child.w * Math.cos(shiftAng)};
        }
        else if (Math.PI < child.ang && child.ang < (Math.PI * 1.5)) { // Quadrant 3
            let shiftAng = child.ang - Math.PI;
            child.B = {x: child.x - child.w * Math.cos(shiftAng), y: child.y + child.w * Math.sin(shiftAng)};
            child.C = {x: child.B.x - child.h * Math.sin(shiftAng), y: child.B.y - child.h * Math.cos(shiftAng)};
            child.D = {x: child.C.x + child.w * Math.cos(shiftAng), y: child.C.y - child.w * Math.sin(shiftAng)};
        }
        else if ((Math.PI * 1.5) < child.ang && child.ang < (Math.PI * 2)) { // Quadrant 4
            let shiftAng = child.ang - Math.PI * 1.5;
            child.B = {x: child.x + child.w * Math.sin(shiftAng), y: child.y + child.w * Math.cos(shiftAng)};
            child.C = {x: child.B.x - child.h * Math.cos(shiftAng), y: child.B.y + child.h * Math.sin(shiftAng)};
            child.D = {x: child.C.x - child.w * Math.sin(shiftAng), y: child.C.y - child.w * Math.cos(shiftAng)};
        }
        else if (child.ang == 0 || child.ang == (Math.PI * 2)) { // X Axis
            //console.log("x Axis");
            child.B = {x: child.x + child.w, y: child.y};
            child.C = {x: child.x + child.w, y: child.y + child.h};
            child.D = {x: child.x, y: child.y + child.h};
        }
        else if (child.ang == Math.PI) { // X Axis flipped
            //console.log("x Axis");
            child.B = {x: child.x - child.w, y: child.y};
            child.C = {x: child.x - child.w, y: child.y - child.h};
            child.D = {x: child.x, y: child.y - child.h};
        }
        else if (child.ang == Math.PI * 0.5) { // Y Axis
            child.B = {x: child.x, y: child.y - child.w};
            child.C = {x: child.x + child.h, y: child.y - child.w};
            child.D = {x: child.x + child.h, y: child.y};
        }
        else if (child.ang == Math.PI * 1.5) { // Y Axis flipped
            child.B = {x: child.x, y: child.y + child.w};
            child.C = {x: child.x - child.h, y: child.y + child.w};
            child.D = {x: child.x - child.h, y: child.y};
        }
        else { // Invalid angle
            throw Error("Invalid angle input. Valid angles: 0-2PI");
        }
    }
}

class Paddle extends Rectangle
{
    constructor (context, x, y, vx, vy, width, height, speed, angle) {
        super(context, x, y, vx, vy, width, height, speed, angle);
    }

    draw(){
        if (upPressed && (this.colorIndex < this.colorList.length - 1) && upHeld == false) {
            this.colorIndex++;
            upHeld = true;
        }
        else if (upPressed && upHeld == false) {
            this.colorIndex = 0;
            upHeld = true;
        }
        Rectangle.prototype.draw(this);
    }

    update(secondsPassed) {

        let normV = {x: (this.B.x - this.A.x) / this.w, y: (this.B.y - this.A.y) / this.w};

        if (leftPressed) {
            this.x -= normV.x * this.s * secondsPassed;
            this.y -= normV.y * this.s * secondsPassed;
        }
        else if (rightPressed) {
            this.x += normV.x * this.s * secondsPassed;
            this.y += normV.y * this.s * secondsPassed;
        }
        Rectangle.prototype.update(this);
    }
}

class Wall extends Rectangle
{
    constructor (context, x, y, vx, vy, width, height, speed, angle) {
        super(context, x, y, vx, vy, width, height, speed, angle);
    }

    draw(){
        this.context.fillStyle = this.isColliding ? '#ff8080' : this.colorList[1];
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
        this.context.fillStyle = this.isColliding ? '#ff8080' : this.colorList[1];
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.context.fill();
        // Drawing vector
        this.context.translate(this.x, this.y);
        this.context.rotate(Math.atan2(this.vy, this.vx));
        this.context.beginPath();
        this.context.moveTo(0,0);
        this.context.lineTo(this.r, 0);
        this.context.strokeStyle = '#000000';
        this.context.stroke();
        this.context.restore();
    }

    update(secondsPassed) {
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}
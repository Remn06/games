/// <reference path="IntersectObject.ts" />

class MovingObject extends IntersectObject {

    speed: number = 0;
    direction: MovingObjectDirection = MovingObjectDirection.east;

    constructor() {
        super();
    }

    update() {
        switch(this.direction){
            case MovingObjectDirection.north:
                this.top -= this.speed;
                break;
            case MovingObjectDirection.northeast:
                this.top -= this.speed;
                this.left += this.speed;
                break;
            case MovingObjectDirection.east:
                this.left += this.speed;
                break;
            case MovingObjectDirection.southeast:
                this.top += this.speed;
                this.left += this.speed;
                break;
            case MovingObjectDirection.south:
                this.top += this.speed;
                break;
            case MovingObjectDirection.southwest:
                this.top += this.speed;
                this.left -= this.speed;
                break;
            case MovingObjectDirection.west:
                this.left -= this.speed;
                break;
            case MovingObjectDirection.northwest:
                this.top -= this.speed;
                this.left -= this.speed;
                break;
        }
    }

    updateDirection() {
        let deg = this.direction * 45 - 90;
        this.element.css('transform', 'rotate('+deg+'deg)');
    }

    turnRight(steps: number){
        this.direction += steps;
        if(this.direction > 7){
            this.direction = this.direction - 8;
        }
        this.updateDirection();
    };

    turnLeft(steps: number) {
        this.direction -= steps;
        if(this.direction < 0) {
            this.direction = 8 + this.direction;
        }
        this.updateDirection();
    };
}


/// <reference path="MovingObject.ts" />

class Asteroid extends MovingObject {
    constructor () {
        super();

        this.width = 25;
        this.height = 25;
    }

    start() {
        super.start();
        this.element.addClass('asteroid');
    }

    update() {
        let oldTop = this.top;
        let oldLeft = this.left;

        super.update();

        if(this.checkCollision === false) {
            if(!GameManager.instance().isInsideGameArea(this)){
                return;
            }
            this.checkCollision = true;
        }

        let gameAreaWidth = this.gameArea.width();
        let gameAreaHeight = this.gameArea.height();
        if(this.top < 0 || this.left < 0 || (this.left + this.width) > gameAreaWidth || (this.top + this.height) > gameAreaHeight) {
            this.checkRicochet(gameAreaWidth, gameAreaHeight);
            this.top = oldTop;
            this.left = oldLeft;
        }
    };

    checkRicochet(gameAreaWidth: number, gameAreaHeight: number){
        if((this.top + this.height) > gameAreaHeight){
            if(this.direction === MovingObjectDirection.southeast) {
                this.turnLeft(2);
            } else if(this.direction === MovingObjectDirection.south){
                this.direction = MovingObjectDirection.north;
            } else if(this.direction === MovingObjectDirection.southwest){
                this.turnRight(2);
            }
        }
        if((this.left + this.width) > gameAreaWidth){
            if(this.direction === MovingObjectDirection.northeast) {
                this.turnLeft(2);
            } else if(this.direction === MovingObjectDirection.east){
                this.direction = MovingObjectDirection.west;
            } else if(this.direction === MovingObjectDirection.southeast){
                this.turnRight(2);
            }
        }
        if(this.top < 0){
            if(this.direction === MovingObjectDirection.northeast) {
                this.turnRight(2);
            } else if(this.direction === MovingObjectDirection.north){
                this.direction = MovingObjectDirection.south;
            } else if(this.direction === MovingObjectDirection.northwest){
                this.turnLeft(2);
            }
        }
        if(this.left < 0){
            if(this.direction === MovingObjectDirection.northwest) {
                this.turnRight(2);
            } else if(this.direction === MovingObjectDirection.west){
                this.direction = MovingObjectDirection.east;
            } else if(this.direction === MovingObjectDirection.southwest){
                this.turnLeft(2);
            }
        }
        this.updateDirection();
    }

    draw() {
        super.draw();
    }

}


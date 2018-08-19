/// <reference path="MovingObject.ts" />

class StarShip extends MovingObject {

    constructor(){
        super();
        this.width = 50;
        this.height = 50;
    }

    start() {
        super.start();
        this.element.addClass('starShip');
        setTimeout(() => {
            this.checkCollision = true;
        }, 3000);
    }

    update() {
        let oldTop = this.top;
        let oldLeft = this.left;

        super.update();

        let gameAreaWidth = this.gameArea.width();
        let gameAreaHeight = this.gameArea.height();
        if(this.top < 0 || this.left < 0 || (this.left + this.width) > gameAreaWidth || (this.top + this.height) > gameAreaHeight) {
            this.checkRicochet(gameAreaWidth, gameAreaHeight);
            this.top = oldTop;
            this.left = oldLeft;
        }
    }

    checkRicochet(gameAreaWidth: number, gameAreaHeight: number){
        if((this.top + this.height) > gameAreaHeight){
            if(this.direction === MovingObjectDirection.southeast) {
                this.turnLeft(1);
            } else if(this.direction === MovingObjectDirection.south){
                this.direction = MovingObjectDirection.north;
            } else if(this.direction === MovingObjectDirection.southwest){
                this.turnRight(1);
            }
        }
        if((this.left + this.width) > gameAreaWidth){
            if(this.direction === MovingObjectDirection.northeast) {
                this.turnLeft(1);
            } else if(this.direction === MovingObjectDirection.east){
                this.direction = MovingObjectDirection.west;
            } else if(this.direction === MovingObjectDirection.southeast){
                this.turnRight(1);
            }
        }
        if(this.top < 0){
            if(this.direction === MovingObjectDirection.northeast) {
                this.turnRight(1);
            } else if(this.direction === MovingObjectDirection.north){
                this.direction = MovingObjectDirection.south;
            } else if(this.direction === MovingObjectDirection.northwest){
                this.turnRight(1);
            }
        }
        if(this.left < 0){
            if(this.direction === MovingObjectDirection.northwest) {
                this.turnRight(1);
            } else if(this.direction === MovingObjectDirection.west){
                this.direction = MovingObjectDirection.east;
            } else if(this.direction === MovingObjectDirection.southwest){
                this.turnRight(1);
            }
        }
        this.updateDirection();
    }

    onAction(action: Action) {
        if(action === Action.left) {
            this.turnLeft(1);
        }
        if(action === Action.right) {
            this.turnRight(1);
        }
        if(action === Action.forward) {
            this.speed++;
        }
        if(action === Action.backward) {
            this.speed--;
        }
        if(action === Action.fire) {
            let bullet = new Bullet();
            bullet.speed = this.speed + 1;
            bullet.direction = this.direction;

            if(this.direction === MovingObjectDirection.north) {
                bullet.left = this.left + (this.width / 2 - bullet.width / 2);
                bullet.top = this.top - bullet.height;
            }

            if(this.direction === MovingObjectDirection.northeast) {
                bullet.left = this.left + this.width;// - bullet.width;
                bullet.top = this.top - bullet.height; // + bullet.height / 2;
            }

            if(this.direction === MovingObjectDirection.east) {
                bullet.left = this.left + this.width;
                bullet.top = (this.top + this.height / 2) - bullet.height / 2;
            }

            if(this.direction === MovingObjectDirection.southeast) {
                bullet.left = this.left + this.width;
                bullet.top = this.top + this.height;
            }

            if(this.direction === MovingObjectDirection.south) {
                bullet.left = this.left + (this.width / 2 - bullet.width / 2);
                bullet.top = this.top + this.height;
            }

            if(this.direction === MovingObjectDirection.southwest) {
                bullet.left = this.left - bullet.width;
                bullet.top = this.top + this.height;
            }

            if(this.direction === MovingObjectDirection.west) {
                bullet.left = this.left - bullet.width;
                bullet.top = this.top + (this.height / 2 - bullet.height / 2);
            }

            if(this.direction === MovingObjectDirection.northwest) {
                bullet.left = this.left - bullet.width;
                bullet.top = this.top - bullet.height;
            }

            GameManager.instance().addGameObject(bullet);
        }
        if(this.speed < 0){
            this.speed = 0;
        }
    }

}

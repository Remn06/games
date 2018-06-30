/// <reference path="MovingObject.ts" />

class Bullet extends MovingObject {

    constructor() {
        super();
        this.width = 10;
        this.height = 10;
    }

    start() {
        super.start();
        this.element.addClass('bullet');
    }

    update() {
        super.update();
        let gameAreaWidth = this.gameArea.width();
        let gameAreaHeight = this.gameArea.height();
        if (this.top < 0 || this.left < 0 || (this.left + this.width) > gameAreaWidth || (this.top + this.height) > gameAreaHeight) {
            GameManager.instance().removeGameObject(this);
        }
    }

}


/// <reference path="MovingObject.ts" />

class Bullet extends MovingObject {

    constructor() {
        super();
        this.transform.width = 10;
        this.transform.height = 10;
    }

    start() {
        super.start();
        const renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        (renderer as HtmlRenderer).element.addClass('bullet');
    }

    update() {
        super.update();
        const renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        let gameAreaWidth = (renderer as HtmlRenderer).gameArea.width();
        let gameAreaHeight = (renderer as HtmlRenderer).gameArea.height();
        if (this.transform.top < 0 || this.transform.left < 0 || (this.transform.left + this.transform.width) > gameAreaWidth || (this.transform.top + this.transform.height) > gameAreaHeight) {
            GameManager.instance().removeGameObject(this);
        }
    }

}


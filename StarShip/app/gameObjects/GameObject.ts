class GameObject {
    left: number = 0;
    top: number = 0;
    width: number = 100;
    height: number = 100;
    checkCollision: boolean = true;
    drawTransparentCollision = true;

    protected gameArea: JQuery = $('#gameArea');
    protected element: JQuery = null;

    constructor() {

    }

    start() {
        this.element = $('<div></div>');
        this.gameArea.append(this.element);
    };

    draw() {
        this.element.css({'left': this.left + 'px', 'top': this.top + 'px'});
        if(this.checkCollision === false && this.drawTransparentCollision === true) {
            this.element.addClass('halfTransparent');
        } else {
            this.element.removeClass('halfTransparent');
        }
    };

    update() {

    }

    destroy() {
        this.element.remove();
    };

    intersects(gameObject: GameObject): boolean {
        if(
            (gameObject.left >= this.left && gameObject.left <= this.left + this.width) &&
            (gameObject.top >= this.top && gameObject.top <= this.top + this.height)
           ) {
            return true;
        }
        if(
            (gameObject.left >= this.left && gameObject.left <= this.left + this.width) &&
            (gameObject.top + gameObject.height >= this.top && gameObject.top + gameObject.height <= this.top + this.height)
        ) {
            return true;
        }
        if(
            (gameObject.left + gameObject.width >= this.left && gameObject.left + gameObject.width <= this.left + this.width) &&
            (gameObject.top + gameObject.height >= this.top && gameObject.top + gameObject.height <= this.top + this.height)
        ) {
            return true;
        }
        if(
            (gameObject.left + gameObject.width >= this.left && gameObject.left + gameObject.width <= this.left + this.width) &&
            (gameObject.top >= this.top && gameObject.top <= this.top + this.height)
        ) {
            return true;
        }

    }
}
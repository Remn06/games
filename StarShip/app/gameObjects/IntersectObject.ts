class IntersectObject extends GameObject {
    checkCollision: boolean = true;
    drawTransparentCollision = true;

    draw() {
        super.draw();

        if(this.checkCollision === false && this.drawTransparentCollision === true) {
            this.element.addClass('halfTransparent');
        } else {
            this.element.removeClass('halfTransparent');
        }
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

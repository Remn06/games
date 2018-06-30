/// <reference path="GameObject.ts" />

class AnimatedObject extends GameObject {

    protected slide = 0;
    private counter = 0;

    constructor (protected pathToTexture: string, protected slideWidth: number, protected slideHeight: number,
                 protected slidesCount: number, protected slidesInARow: number, protected animationSpeed: number,
                 protected repeat: boolean, private animationFinished: Function) {
        super();
        this.drawTransparentCollision = false;
    }

    start() {
        super.start();

        this.element.css({'background-image': 'url("'+this.pathToTexture+'")'});
        this.element.css({'position': 'absolute'});
       // this.element.css({'background-repeat': 'no-repeat'});
       // this.element.css({'background-attachment': 'fixed'});

    }
    draw() {
        super.draw();
        this.element.css({'width': this.slideWidth + 'px', 'height': this.slideHeight + 'px'});

        let y = Math.floor(this.slide / this.slidesInARow);  // (this.slide * this.slideWidth)
        let x = this.slide - (y * this.slidesInARow) - 1;
        let backPos = '-' + (x * this.slideWidth) + 'px -' + (y * this.slideHeight) + 'px';
        this.element.css({'background-position':  backPos});
    }
    update() {
  /*      this.counter++;
        if(this.counter > 2) {
            this.counter = 0;
*/
            this.slide++;
            if(this.slide >= this.slidesCount) {
                if(this.animationFinished != null) {
                    this.animationFinished();
                }
                this.slide = 0;
            }
/*
        }*/
        super.update();
    }
}


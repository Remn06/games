class GameOverObject extends GameObject {
    private gameOverText: string = 'GAME OVER';

    constructor(){
        super();
    }

    public start() {
        super.start();
        this.element.addClass('gameOverText');
        this.element.css({
            'width': '',
            'height': ''
        });
    }

    public draw() {
        super.draw();
        this.element.text(this.gameOverText);
    }

    public update() {
        super.update();
        this.left = this.gameArea.width() / 2 - this.element.width() / 2;
        this.top = this.gameArea.height() / 2 - this.element.height() / 2;
    }

}

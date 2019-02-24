class GameOverObject extends GameObject {
    private gameOverText: string = 'GAME OVER';

    constructor(){
        super();
    }

    public start() {
        super.start();
        const renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        (renderer as HtmlRenderer).element.addClass('gameOverText');
        (renderer as HtmlRenderer).element.css({
            'width': '',
            'height': ''
        });
    }

    public draw() {
        super.draw();
        const renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        (renderer as HtmlRenderer).element.text(this.gameOverText);
    }

    public update() {
        super.update();
        const renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        this.transform.left = (renderer as HtmlRenderer).gameArea.width() / 2 - (renderer as HtmlRenderer).element.width() / 2;
        this.transform.top = (renderer as HtmlRenderer).gameArea.height() / 2 - (renderer as HtmlRenderer).element.height() / 2;
    }

}

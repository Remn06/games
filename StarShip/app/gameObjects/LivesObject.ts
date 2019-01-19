class LivesObject extends GameObject {
    private lives: number = null;
    private elementWidth: number = 25;
    private drawnLives: number = 0;

    constructor() {
        super();
        this.width = this.elementWidth * this.lives;
    }

    public start(){
        super.start();

    }

    public draw() {
        super.draw();
        if(this.drawnLives === this.lives) {
            return;
        }
        this.element.empty();
        for(let i = 0; i < this.lives; i++) {
            let liveElement = $('<div class="livesIndicatorElement"></div>');
            liveElement.css({
                'left': i * this.elementWidth + 'px'
            });

            this.element.append(liveElement);
        }
        this.drawnLives = this.lives;
    }

    public update(){
        super.update();
        this.lives = GameManager.instance().getLives();
    }
}

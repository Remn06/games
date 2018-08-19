class ScoreIndicator extends GameObject {
    private score: number = null;

    public start() {
        super.start();
        this.element.addClass('scoreIndicator');
    }

    public draw() {
        super.draw();
        this.element.text(this.score.toString());
    }

    public update() {
        super.update();
        this.score = GameManager.instance().getScore();
    }

}

class ScoreIndicator implements IComponent {

    private score: number = null;
    protected gameObject: GameObject;

    public name: string;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
    }

    public start() {

    }

    public draw() {
        const renderer = this.gameObject.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        (renderer as HtmlRenderer).element.text(this.score.toString());
    }

    public update() {
        this.score = GameManager.instance().getScore();
    }
    public destroy() {

    }
}

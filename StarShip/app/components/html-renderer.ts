class HtmlRenderer implements IComponent {

    public name: string;
    public className: string;
    public element: JQuery = null;

    public gameArea: JQuery = $('#gameArea');

    protected gameObject: GameObject;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
    }

    start(): void {
        this.element = $('<div></div>');
        this.element.addClass('gameObject');

        if(this.className != null) {
            this.element.addClass(this.className);
        }

        this.element.css({
            'width': this.gameObject.transform.width + 'px',
            'height': this.gameObject.transform.height + 'px'
        });
        this.gameArea.append(this.element);
    }

    draw(): void {
        this.element.css({
            'left': this.gameObject.transform.left + 'px',
            'top': this.gameObject.transform.top + 'px'
        });
    }

    update(): void {
    }

    destroy(): void {
        this.element.remove();
    }
}
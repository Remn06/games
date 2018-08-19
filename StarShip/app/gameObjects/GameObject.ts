class GameObject {
    left: number = 0;
    top: number = 0;
    width: number = 100;
    height: number = 100;

    protected gameArea: JQuery = $('#gameArea');
    protected element: JQuery = null;

    constructor() {

    }

    start() {
        this.element = $('<div></div>');
        this.gameArea.append(this.element);
        this.element.addClass('gameObject');
        this.element.css({
            'width': this.width + 'px',
            'height': this.height + 'px'
        });
    };

    draw() { //todo check how object is drawing according to its width and height.
        this.element.css({
            'left': this.left + 'px',
            'top': this.top + 'px'
        });
    };

    update() {

    }

    destroy() {
        this.element.remove();
    };
}
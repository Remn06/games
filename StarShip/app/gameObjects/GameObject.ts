class GameObject implements IComponent{

    public name: string = null;

    public components: IComponent[] = [];

    public transform: Transform = new Transform();

    constructor() {
    }

    public getComponent(name: string): IComponent {
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].name === name) {
                return this.components[i];
            }
        }
        return null;
    }

    start(): void {
        if(this.components.length === 0) {
            const component = new HtmlRenderer(this);
            component.name = 'HtmlRenderer';
            this.components.push(component);
        }

        this.components.forEach(
            (component) => {
                component.start();
            }
        );
    };

    draw() {
        this.components.forEach(
            (component) => {
                component.draw();
            }
        );
    };

    update() {
        this.components.forEach(
            (component) => {
                component.update();
            }
        );
    }

    destroy() {
        this.components.forEach(
            (component) => {
                component.destroy();
            }
        );
    }
}

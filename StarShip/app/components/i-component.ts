interface IComponent {
    name: string;
    start(): void;
    draw(): void;
    update(): void;
    destroy(): void;
}
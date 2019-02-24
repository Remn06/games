class ComponentBuilder {

    public static build(gameObject: GameObject, componentData: IComponentData): IComponent {
        let component: IComponent;
        switch (componentData.name) {
            case 'HtmlRenderer':
                component = new HtmlRenderer(gameObject);
                component.name = componentData.name;
                break;
            case 'ScoreIndicator':
                component = new ScoreIndicator(gameObject);
                component.name = componentData.name;
                break;
            default:
                throw new Error('Component is not implemented');
        }

        componentData.data.forEach((dataItem) => {
            (component as any)[dataItem.name] = dataItem.value;
        });

        return component;
    }
}
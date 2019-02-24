class GameLoader {

    public static load(data: IGameData): GameObject[]{
        const gameObjects: GameObject[] = [];

        data.scenes[0].gameObjects.forEach((gameObjectData) => {
           const gameObject = GameObjectBuilder.build(gameObjectData);
           gameObjectData.components.forEach((componentData) => {
              const component = ComponentBuilder.build(gameObject, componentData);
              gameObject.components.push(component);
           });
           gameObjects.push(gameObject);
        });

        return gameObjects;
    }
}
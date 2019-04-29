import { GameScene } from '../game-structure/game-scene';
import { GameObject } from '../game-structure/game-object';
import { Vector2 } from '../common/vector2';
import { Transform } from '../game-structure/transform';
import { GameComponent } from '../game-components/base/game-component';
import { NameValuePair } from '../common/name-value-pair';
import { GameData } from '../game-structure/game-data';
import { ComponentsRegistry } from '../game-components/base/components-registry';

enum ComponentsNames {
	htmlRendererGameComponent = 'HtmlRendererGameComponent',
	simpleMoveGameComponent = 'SimpleMoveGameComponent',
	shiftRightComponent = 'ShiftRightComponent',
	resetToLeftComponent = 'ResetToLeftComponent'
}

export class HardcodedGameData {

	public static getData(): GameData {
		const gameData = new GameData();
		gameData.scenes = [];
		gameData.scenes.push(HardcodedGameData.getScene());
		gameData.defaultSceneName = gameData.scenes[0].name;
		return gameData;
	}

	private static getScene(): GameScene {
		const scene = new GameScene();
		scene.name = 'Main Scene';
		scene.gameObjects = [];
		HardcodedGameData.fillWithGameObjects(scene);
		HardcodedGameData.setLinks(scene.gameObjects);
		return scene;
	}

	private static setLinks(gameObjects: GameObject[]): void {
		gameObjects.forEach((go) => {
			go.components.forEach((c) => {
				c.gameObject = go;
			});
		});
	}

	private static fillWithGameObjects(scene: GameScene): void {
		scene.gameObjects.push(HardcodedGameData.createGameObject(
			'GameObject',
			HardcodedGameData.createTransform(new Vector2(300, 100), 100, 100, 0),
			[
				HardcodedGameData.getComponent(ComponentsNames.htmlRendererGameComponent, [new NameValuePair('className', 'star-ship')]),
				HardcodedGameData.getComponent(ComponentsNames.simpleMoveGameComponent, [
					new NameValuePair('speed', 100),
					new NameValuePair('direction', new Vector2(1, 0.5)),
					new NameValuePair('rotation', 90)
				]),
				HardcodedGameData.getComponent(ComponentsNames.shiftRightComponent, [
					new NameValuePair('speed', 100)
				]),
				HardcodedGameData.getComponent(ComponentsNames.resetToLeftComponent, [])

			]
		));
		scene.gameObjects.push(HardcodedGameData.createGameObject(
			'GameObject1',
			HardcodedGameData.createTransform(new Vector2(100, 100), 100, 100, 0),
			[ HardcodedGameData.getComponent(ComponentsNames.htmlRendererGameComponent, [new NameValuePair('className', 'game-object')]) ]
		));
	}

	private static createGameObject(name: string, transform: Transform, components: GameComponent[]): GameObject {
		const gameObject = new GameObject();
		gameObject.name = name;
		gameObject.transform = transform;
		components.forEach((c) => {
			if (c.gameObject == null) {
				c.gameObject = gameObject;
			}
		});
		gameObject.components = components;
		return gameObject;
	}

	private static createTransform(position: Vector2, width: number, height: number, rotation: number): Transform {
		const transform = new Transform();
		transform.position = position;
		transform.width = width;
		transform.height = height;
		transform.rotation = rotation;
		return transform;
	}

	public static getComponent(componentName: ComponentsNames, params: NameValuePair[]): GameComponent {
		const componentConstructor = ComponentsRegistry.registry.get(componentName)();
		if (componentConstructor == null) {
			throw new Error('Component IS Not Implemented');
		}
		const component = new componentConstructor();
		(params || []).forEach((p) => {
			component[p.name] = p.value;
		});
		return component as GameComponent;
	}
}

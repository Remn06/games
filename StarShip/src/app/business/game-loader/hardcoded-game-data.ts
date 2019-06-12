import { GameScene } from '../game-structure/game-scene';
import { GameObject } from '../game-structure/game-object';
import { Vector2 } from '../common/vector2';
import { Transform } from '../game-structure/transform';
import { GameComponent, IGameComponent } from '../game-components/core/base/game-component';
import { NameValuePair } from '../common/name-value-pair';
import { GameData } from '../game-structure/game-data';
import { ComponentsRegistry } from '../game-components/core/base/components-registry';

enum ComponentsNames {
	htmlRendererGameComponent = 'HtmlRendererGameComponent',
	simpleMoveGameComponent = 'SimpleMoveGameComponent',
	shiftRightComponent = 'ShiftRightComponent',
	resetToLeftComponent = 'ResetToLeftComponent',
	rotateComponent = 'RotateComponent',
	showHideGameObjectComponent = 'ShowHideGameObjectComponent',
	TestOneComponent = 'TestOneComponent'
}

export class HardcodedGameData {

	public static getData(): GameData {
		return new GameData([HardcodedGameData.getScene()]);
	}

	private static getScene(): GameScene {
		const scene = new GameScene('Main Scene', []);
		HardcodedGameData.fillWithGameObjects(scene);
		return scene;
	}

	private static fillWithGameObjects(scene: GameScene): void {
		const starShip = HardcodedGameData.createGameObject( null,
			'StarShip',
			HardcodedGameData.createTransform(new Vector2(100, 100), 100, 100, 0),
			[
				HardcodedGameData.getComponent(ComponentsNames.htmlRendererGameComponent, [
					new NameValuePair('backgroundImage', 'url("assets/img/death-star.png")'),
					new NameValuePair('cssStyle', 'color: white; font-size: 40px;')
				], true),
				HardcodedGameData.getComponent(ComponentsNames.simpleMoveGameComponent, [
					new NameValuePair('speed', 100),
					new NameValuePair('direction', new Vector2(1, 0.5)),
					new NameValuePair('rotation', 45)
				], true),
				HardcodedGameData.getComponent(ComponentsNames.shiftRightComponent, [
					new NameValuePair('speed', 100)
				], true),
				HardcodedGameData.getComponent(ComponentsNames.resetToLeftComponent, [], true)
			],
			true,
			'Mighty Death Star!'
		);
		scene.gameObjects.push(starShip);

		const bullet = HardcodedGameData.createGameObject(
			scene.gameObjects[0],
			'Satellite',
			HardcodedGameData.createChildTransform(starShip.transform, new Vector2(0, 70), 20, 20, 180),
			[
				HardcodedGameData.getComponent(ComponentsNames.htmlRendererGameComponent, [
					new NameValuePair('backgroundImage', 'url("assets/img/cruiser.png")')
				], true),
				HardcodedGameData.getComponent(ComponentsNames.rotateComponent, [
					new NameValuePair('rotation', 90)
				], true)
			],
			true
		);
		scene.gameObjects[0].children.push(bullet);

		const shComponent = HardcodedGameData.getComponent(ComponentsNames.showHideGameObjectComponent, [], true);
		(shComponent as any).gameObjectToHide = bullet;
		starShip.components.push(shComponent);

/*
		const buttonOne = HardcodedGameData.createGameObject(null,
			'Button One',
			HardcodedGameData.createTransform(new Vector2(10, 200), 150, 30, 0),
			[
				HardcodedGameData.getComponent(ComponentsNames.htmlRendererGameComponent, [
					new NameValuePair('cssStyle', 'color: white; font-size: 25px; background-color: #555; text-align: center; padding: 5px;')
				], true),
				HardcodedGameData.getComponent(ComponentsNames.TestOneComponent, [
					new NameValuePair('speed', 150),
					new NameValuePair('startX', -175),
					new NameValuePair('stopX', 90)
				], true)
			],
			true,
			'Button One'
		);

		scene.gameObjects.push(buttonOne);

		const buttonTwo = HardcodedGameData.createGameObject(null,
			'Button One',
			HardcodedGameData.createTransform(new Vector2(10, 250), 150, 30, 0),
			[
				HardcodedGameData.getComponent(ComponentsNames.htmlRendererGameComponent, [
					new NameValuePair('cssStyle', 'color: white; font-size: 25px; background-color: #555; text-align: center; padding: 5px;')
				], true),
				HardcodedGameData.getComponent(ComponentsNames.TestOneComponent, [
					new NameValuePair('speed', 150),
					new NameValuePair('startX', -200),
					new NameValuePair('stopX', 90)
				], true)
			],
			true,
			'Button One'
		);

		scene.gameObjects.push(buttonTwo);

		const buttonThree = HardcodedGameData.createGameObject(null,
			'Button One',
			HardcodedGameData.createTransform(new Vector2(10, 300), 150, 30, 0),
			[
				HardcodedGameData.getComponent(ComponentsNames.htmlRendererGameComponent, [
					new NameValuePair('cssStyle', 'color: white; font-size: 25px; background-color: #555; text-align: center; padding: 5px;')
				], true),
				HardcodedGameData.getComponent(ComponentsNames.TestOneComponent, [
					new NameValuePair('speed', 150),
					new NameValuePair('startX', -225),
					new NameValuePair('stopX', 90)
				], true)
			],
			true,
			'Button One'
		);

		scene.gameObjects.push(buttonThree);
		*/
	}

	private static createGameObject(
			parent: GameObject,
			name: string,
			transform: Transform,
			components: GameComponent[],
			active: boolean, text: string = null): GameObject {

		const gameObject = new GameObject();
		gameObject.name = name;
		gameObject.transform = transform;
		components.forEach((c) => {
			if (c.gameObject == null) {
				c.gameObject = gameObject;
			}
		});
		gameObject.components = components;
		gameObject.transform.gameObject = gameObject;
		gameObject.parent = parent;
		gameObject.active = active;
		gameObject.text = text;
		return gameObject;
	}

	private static createTransform(position: Vector2, width: number, height: number, rotation: number): Transform {
		return Transform.instantiate(position, rotation, width, height);
	}

	private static createChildTransform(
			parent: Transform,
			localPosition: Vector2,
			width: number,
			height: number,
			rotation: number): Transform {
		return Transform.instantiateChild(parent, localPosition, rotation, width, height);
	}


	public static getComponent(componentName: ComponentsNames, params: NameValuePair[], active: boolean): GameComponent {
		const componentConstructor = ComponentsRegistry.registry.get(componentName)();
		if (componentConstructor == null) {
			throw new Error('Component IS Not Implemented');
		}
		const component = new componentConstructor() as IGameComponent;
		(params || []).forEach((p) => {
			component[p.name] = p.value;
		});
		component.active = active;
		return component as GameComponent;
	}
}

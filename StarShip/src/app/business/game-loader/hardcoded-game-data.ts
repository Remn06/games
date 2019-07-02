import { GameScene } from '../game-structure/game-scene';
import { GameObject } from '../game-structure/game-object';
import { Vector2 } from '../common/vector2';
import { NameValuePair } from '../common/name-value-pair';
import { GameData } from '../game-structure/game-data';
import { ComponentFactory } from '../core/factory/component-factory';
import { SparksComponent } from '../game-components/user/sparks.component';
import { GameObjectFactory } from '../core/factory/game-object-factory';
import { TransformFactory } from '../core/factory/transform-factory';
import { HtmlRendererGameComponent } from '../game-components/core/html-renderer-game-component/html-renderer-game-component';
import { SimpleMoveGameComponent } from '../game-components/user/simple-move-game-component';
import { ShiftRightComponent } from '../game-components/user/shift-right.component';
import { ResetToLeftComponent } from '../game-components/user/reset-to-left.component';
import { RotateComponent } from '../game-components/user/rotate.component';
import { ShowHideGameObjectComponent } from '../game-components/user/show-hide-game-object-component';


export class HardcodedGameData {

	public static getData(): GameData {
		return new GameData(
			[
				HardcodedGameData.getScene()
			]
		);
	}

	private static getScene(): GameScene {
		const rootGameObject = HardcodedGameData.createGameObjects();
		return new GameScene('Main Scene', rootGameObject);
	}

	private static createGameObjects(): GameObject {

		const rootGameObject = GameObjectFactory.createGameObject(
			null,
			'root',
			TransformFactory.createTransform(new Vector2(0, 0), 0, 0, 0),
			[],
			true
		);

		const starShip = GameObjectFactory.createGameObject( rootGameObject,
			'StarShip',
			TransformFactory.createTransform(new Vector2(300, 300), 100, 100, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', 'url("assets/img/death-star.png")'),
					new NameValuePair('cssStyle', 'color: white; font-size: 40px;')
				], true),
				ComponentFactory.createComponent(SimpleMoveGameComponent, [
					new NameValuePair('speed', 100),
					new NameValuePair('direction', new Vector2(1, 0.5)),
					new NameValuePair('rotation', 45)
				], true),
				ComponentFactory.createComponent(ShiftRightComponent, [
					new NameValuePair('speed', 100)
				], true),
				ComponentFactory.createComponent(ResetToLeftComponent, [], true)
			],
			true
		);

		const bullet = GameObjectFactory.createGameObject(
			starShip,
			'Satellite',
			TransformFactory.createChildTransform(starShip.transform, new Vector2(0, 70), 30, 30, 180),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', 'url("assets/img/cruiser.png")')
				], true),
				ComponentFactory.createComponent(RotateComponent, [
					new NameValuePair('rotation', 90)
				], true),
				ComponentFactory.createComponent(SparksComponent, [
					new NameValuePair('active', true),
					new NameValuePair('amount', 100),
					new NameValuePair('speed', 1)
				])
			],
			true
		);

		const shComponent = ComponentFactory.createComponent<ShowHideGameObjectComponent>(ShowHideGameObjectComponent, [], true);
		shComponent.gameObjectToHide = bullet;
		starShip.components.push(shComponent);

		GameObjectFactory.createGameObject(
			rootGameObject,
			'Button 1',
			TransformFactory.createTransform(new Vector2(80, 25), 150, 25, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('cssStyle', 'color: #aaa; font-size: 20px, padding: 5px; text-align: center;'),
					new NameValuePair('backgroundImage', 'url("assets/img/button-one.png")')
				], true)
			],
			true,
			'BUTTON ONE!!!'
		);

		return rootGameObject;
	}
}

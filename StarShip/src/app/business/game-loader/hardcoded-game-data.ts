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
import { RotateComponent } from '../game-components/user/rotate.component';
import { ShowHideGameObjectComponent } from '../game-components/user/show-hide-game-object-component';
import { Rect } from '../common/rect';
import { WalkerComponent } from '../game-components/user/walker.component';
import { VMath } from '../common/v-math';
import { AnimateGameComponent } from '../game-components/core/animate-game-component/animate-game-component';
import { StartButtonGameComponent } from '../../_gameDino/components/start-button-game-component';
import { CloudMoverGameComponent } from '../../_gameDino/components/cloud-mover-game-component';
import { DinoJumpGameComponent } from '../../_gameDino/components/dino-jump-game-component';
import { GroundMoverComponent } from '../../_gameDino/components/ground-mover-component';
import { CactusMoverGameComponent } from '../../_gameDino/components/cactus-mover-game-component';
import { ScoreGameComponent } from '../../_gameDino/components/score-game-component';
import { CenterPositionGameComponent } from '../../_gameDino/components/center-position-game-component';
import { DinoChangerGameComponent } from '../../_gameDino/components/dino-changer-game-component';
import { SoundPlayerGameComponent } from '../game-components/core/sound-player-game-component';


export class HardcodedGameData {

	public static getData(): GameData {
		return new GameData(
			[
				HardcodedGameData.getScene()
			]
		);
	}

	private static getScene(): GameScene {
		const rootGameObject = HardcodedGameData.createOfflineGameObjects();
		return new GameScene('Main Scene', rootGameObject);
	}

	private static createOfflineGameObjects(): GameObject {

		const rootGameObject = GameObjectFactory.createGameObject(
			null,
			'root',
			TransformFactory.createTransform(new Vector2(0, 0), 0, 0, 0),
			[],
			true
		);

		GameObjectFactory.createGameObject(rootGameObject, 'Start Button',
			TransformFactory.createTransform(new Vector2(100, 25), 34, 30, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('cssStyle', ''),
					new NameValuePair('backgroundImage', 'assets/_gameDino/img/start-button.png')
				], true),
				ComponentFactory.createComponent(StartButtonGameComponent, []),
				ComponentFactory.createComponent(CenterPositionGameComponent, [
					new NameValuePair('centerByXAxis', true),
					new NameValuePair('centerByYAxis', false),
					new NameValuePair('shift', new Vector2(0, 125))
				]),
			],
			true
		);

		const dynamicObjects = GameObjectFactory.createGameObject(
			rootGameObject,
			'DynamicObjects',
			TransformFactory.createChildTransform(rootGameObject.transform, Vector2.zero, 0, 0, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', `assets/_gameDino/img/cloud.png`)
				], true),
				ComponentFactory.createComponent(DinoChangerGameComponent, [], true),
			],
			true
		);
		dynamicObjects.paused = true;

		GameObjectFactory.createGameObject(dynamicObjects, 'Score',
			TransformFactory.createTransform(new Vector2(100, 25), 200, 30, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('cssStyle', 'font-family: monospace; font-weight: bold; font-size: 20px; color: gray;')
				], true),
				ComponentFactory.createComponent(ScoreGameComponent, []),
				ComponentFactory.createComponent(CenterPositionGameComponent, [
					new NameValuePair('centerByXAxis', true),
					new NameValuePair('centerByYAxis', false),
					new NameValuePair('shift', new Vector2(200, 50))
				]),
			],
			false
		);

		const cloud1 = GameObjectFactory.createGameObject(dynamicObjects, 'Cloud1',
			TransformFactory.createChildTransform(rootGameObject.transform, Vector2.zero, 50, 50, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', `assets/_gameDino/img/cloud.png`)
				], true),
				ComponentFactory.createComponent(CloudMoverGameComponent, [
					new NameValuePair('speed', 100)
				], true)
			],
			true
		);

		const cloud2 = GameObjectFactory.createGameObject(dynamicObjects, 'Cloud2',
			TransformFactory.createChildTransform(rootGameObject.transform, Vector2.zero, 50, 50, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', `assets/_gameDino/img/cloud.png`)
				], true),
				ComponentFactory.createComponent(CloudMoverGameComponent, [
					new NameValuePair('speed', 100)
				], true)
			],
			true
		);

		const cloud3 = GameObjectFactory.createGameObject(dynamicObjects, 'Cloud3',
			TransformFactory.createChildTransform(rootGameObject.transform, Vector2.zero, 50, 50, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', `assets/_gameDino/img/cloud.png`)
				], true),
				ComponentFactory.createComponent(CloudMoverGameComponent, [
					new NameValuePair('speed', 100)
				], true)
			],
			true
		);

		const dino = GameObjectFactory.createGameObject(dynamicObjects, 'Dino',
			TransformFactory.createTransform(new Vector2(50, 200), 50, 50, 0),
			[
				ComponentFactory.createComponent(AnimateGameComponent, [
					new NameValuePair('slideWidth', 50),
					new NameValuePair('slideHeight', 50),
					new NameValuePair('slidesInARow', 2),
					new NameValuePair('slidesCount', 2),
					new NameValuePair('animationSpeed', 12)
				], true),
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', 'assets/_gameDino/img/dino-run-2-slides.png'),
					new NameValuePair('cssStyle', '')
				], true),
				ComponentFactory.createComponent(DinoJumpGameComponent, [
					new NameValuePair('height', 100),
					new NameValuePair('speed', 200)
				], true),
				ComponentFactory.createComponent(SoundPlayerGameComponent, [
					new NameValuePair('sounds', [new NameValuePair('jump', 'assets/_gameDino/sound/jump.mp3')])
				], true)
			],
			true
		);

		const dinoBend = GameObjectFactory.createGameObject(dynamicObjects, 'Dino Bend',
			TransformFactory.createTransform(new Vector2(55, 210), 55, 26, 0),
			[
				ComponentFactory.createComponent(AnimateGameComponent, [
					new NameValuePair('slideWidth', 55),
					new NameValuePair('slideHeight', 26),
					new NameValuePair('slidesInARow', 2),
					new NameValuePair('slidesCount', 2),
					new NameValuePair('animationSpeed', 12)
				], true),
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', 'assets/_gameDino/img/dino-bend-2-slides.png'),
					new NameValuePair('cssStyle', '')
				], true),
				ComponentFactory.createComponent(DinoJumpGameComponent, [
					new NameValuePair('height', 100),
					new NameValuePair('speed', 200)
				], true)
			],
			false
		);

		const groundMover = GameObjectFactory.createGameObject(dynamicObjects, 'GroundMover',
			TransformFactory.createTransform(new Vector2(0, 222), 0, 0, 0),
			[
				ComponentFactory.createComponent(GroundMoverComponent, [
					new NameValuePair('speed', 400),
					new NameValuePair('margin', 100)
				], true),
				// todo remove this component and fix the engine.
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', `assets/_gameDino/img/cloud.png`)
				], true),
			],
			true
		);

		const cactus = GameObjectFactory.createGameObject(dynamicObjects, 'Cactus',
			TransformFactory.createTransform(new Vector2(0, 222), 0, 0, 0),
			[
				ComponentFactory.createComponent(CactusMoverGameComponent, [
					new NameValuePair('speed', 400),
					new NameValuePair('minInterval', 1000),
					new NameValuePair('maxInterval', 2000),
					new NameValuePair('dinoGameObjectName', 'Dino'),
					new NameValuePair('dinoBendGameObjectName', 'Dino Bend')
				], true),
				// todo remove this component and fix the engine.
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', `assets/_gameDino/img/cloud.png`)
				], true),
				ComponentFactory.createComponent(SoundPlayerGameComponent, [
					new NameValuePair('sounds', [new NameValuePair('collide', 'assets/_gameDino/sound/collide.mp3')])
				], true),
			],
			true
		);

		return rootGameObject;
	}

	private static createStarShipGameObjects(): GameObject {

		const rootGameObject = GameObjectFactory.createGameObject(
			null,
			'root',
			TransformFactory.createTransform(new Vector2(0, 0), 0, 0, 0),
			[],
			true
		);

		GameObjectFactory.createGameObject(
			rootGameObject,
			'Button 1',
			TransformFactory.createTransform(new Vector2(100, 25), 150, 25, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('cssStyle', 'color: #FAA; font-size: 14px; padding-top: 5px; text-align: center; cursor: pointer'),
					new NameValuePair('backgroundImage', 'assets/img/button-one.png')
				], true)
			],
			true,
			'BUTTON ONE!!!'
		);

		const deathStar = GameObjectFactory.createGameObject( rootGameObject,
			'DeathStar',
			TransformFactory.createTransform(new Vector2(100, 100), 100, 100, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', 'assets/img/death-star.png'),
					new NameValuePair('cssStyle', 'color: white; font-size: 40px;')
				], true),
				/*ComponentFactory.createComponent(SimpleMoveGameComponent, [
					new NameValuePair('speed', 100),
					new NameValuePair('direction', new Vector2(1, 0.5)),
					new NameValuePair('rotation', 45)
				], true),
				ComponentFactory.createComponent(ShiftRightComponent, [
					new NameValuePair('speed', 100)
				], true),
				ComponentFactory.createComponent(ResetToLeftComponent, [], true)*/
			],
			true
		);

		const satellite = GameObjectFactory.createGameObject(
			deathStar,
			'Satellite',
			TransformFactory.createChildTransform(deathStar.transform, new Vector2(0, 70), 30, 30, 180),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', 'assets/img/cruiser.png')
				], true),
				ComponentFactory.createComponent(RotateComponent, [
					new NameValuePair('rotation', 90)
				], true),
			],
			true
		);

		const SatelliteFire = GameObjectFactory.createGameObject(
			satellite,
			'Satellite fire',
			TransformFactory.createChildTransform(rootGameObject.transform, new Vector2(-15, 0), 2, 2, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
				], true),
				ComponentFactory.createComponent(SparksComponent, [
					new NameValuePair('active', true),
					new NameValuePair('amount', 10),
					new NameValuePair('speed', 10),
					new NameValuePair('gravity', new Vector2(0, 0)),
					new NameValuePair('gravityValue', 9.8),
					new NameValuePair('initScatter', 0),
					new NameValuePair('shift', new Vector2(0, 0))
				], true)
			],
			true
		);

		const shComponent = ComponentFactory.createComponent<ShowHideGameObjectComponent>(ShowHideGameObjectComponent, [], true);
		shComponent.gameObjectToHide = satellite;
		deathStar.components.push(shComponent);


		const shiftX = 400;
		const shiftY = 400;
		const start = new Vector2(0, 200);
		const shiftAngle = 20;
		const mosaics: GameObject[] = [];
		for (let i = 0; i < 360; i += shiftAngle) {
			const curr = VMath.rotate(start, i);
			mosaics.push(HardcodedGameData.createMosaic(curr.x + shiftX, curr.y + shiftY, rootGameObject));
		}

		HardcodedGameData.createStarUnit(rootGameObject, mosaics[0], 'assets/img/unit-round-0-empty.png', 45);
		HardcodedGameData.createStarUnit(rootGameObject, mosaics[8], 'assets/img/unit-round-1-empty.png', 90);
		HardcodedGameData.createStarUnit(rootGameObject, mosaics[12], 'assets/img/unit-round-2-empty.png', 135);
		HardcodedGameData.createStarUnit(rootGameObject, mosaics[4], 'assets/img/unit-round-3-empty.png', 180);

		return rootGameObject;
	}

	private static createMosaic(x: number, y: number, rootGameObject: GameObject): GameObject {
		return GameObjectFactory.createGameObject(
			rootGameObject,
			'mosaic-silver',
			TransformFactory.createChildTransform(rootGameObject.transform, new Vector2(x, y), 50, 50, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', 'assets/img/mosaic-silver.png')
				], true)
			],
			true
		);
	}

	private static createStarUnit(rootGameObject: GameObject, mosaic: GameObject, image, rotateSpeed): GameObject {
		const starUnit = GameObjectFactory.createGameObject(
			rootGameObject,
			'Star Unit',
			TransformFactory.createChildTransform(rootGameObject.transform, mosaic.transform.localPosition.clone(), 77, 77, 45),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', `${image}`)
				], true),
				ComponentFactory.createComponent(WalkerComponent, [
					new NameValuePair('walkArea', new Rect(
						mosaic.transform.localPosition.x - 25,
						mosaic.transform.localPosition.y - 25,
						50,
						50)),
					new NameValuePair('moveSpeed', 25),
					new NameValuePair('rotateSpeed', rotateSpeed)
				], true)
			],
			true
		);

		const starUnitFire = GameObjectFactory.createGameObject(
			starUnit,
			'Star Unit fire',
			TransformFactory.createChildTransform(rootGameObject.transform, new Vector2(0, 0), 2, 2, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
				], true),
				ComponentFactory.createComponent(SparksComponent, [
					new NameValuePair('active', true),
					new NameValuePair('amount', 50),
					new NameValuePair('speed', 1),
					new NameValuePair('gravity', new Vector2(0, 1)),
					new NameValuePair('gravityValue', 2.8),
					new NameValuePair('initScatter', 0),
					new NameValuePair('shift', new Vector2(0, 0))
				])
			],
			true
		);
		return starUnit;
	}
}


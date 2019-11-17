import { GameObject } from '../../business/game-structure/game-object';
import { GameObjectFactory } from '../../business/core/factory/game-object-factory';
import { TransformFactory } from '../../business/core/factory/transform-factory';
import { Vector2 } from '../../business/common/vector2';
import { ComponentFactory } from '../../business/core/factory/component-factory';
import { HtmlRendererGameComponent } from '../../business/game-components/core/html-renderer-game-component/html-renderer-game-component';
import { NameValuePair } from '../../business/common/name-value-pair';
import { CloudShifterComponent } from './cloud-shifter-component';

export class ImpossibleDinoData {
	public static getData(): GameObject {

		const rootGameObject = GameObjectFactory.createGameObject(
			null,
			'root',
			TransformFactory.createTransform(new Vector2(0, 0), 0, 0, 0),
			[
			],
			true
		);

		const cloud = GameObjectFactory.createGameObject(
			rootGameObject,
			'Cloud',
			TransformFactory.createTransform(new Vector2(400, 170), 46, 13, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', 'assets/_games/impossible-dino/img/cloud.png'),
					new NameValuePair('cssStyle', ''),
				], true),
				ComponentFactory.createComponent(CloudShifterComponent, [
					new NameValuePair('speed', 100)
				])
			],
			true
		);

		const cloud2 = GameObjectFactory.createGameObject(
			rootGameObject,
			'Cloud2',
			TransformFactory.createTransform(new Vector2(500, 150), 46, 13, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', 'assets/_games/impossible-dino/img/cloud.png'),
					new NameValuePair('cssStyle', '')
				], true)
			],
			true
		);
		const cloud3 = GameObjectFactory.createGameObject(
			rootGameObject,
			'Cloud3',
			TransformFactory.createTransform(new Vector2(700, 130), 46, 13, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', 'assets/_games/impossible-dino/img/cloud.png'),
					new NameValuePair('cssStyle', '')
				], true)
			],
			true
		);
		const Dino = GameObjectFactory.createGameObject(
			rootGameObject,
			'Dino',
			TransformFactory.createTransform(new Vector2(300, 170), 40, 43, 0),
			[
				ComponentFactory.createComponent(HtmlRendererGameComponent, [
					new NameValuePair('backgroundImage', 'assets/_games/impossible-dino/img/DinoStep1.png'),
					new NameValuePair('cssStyle', '')
				], true)
			],
			true
		);
		return rootGameObject;
	}
}

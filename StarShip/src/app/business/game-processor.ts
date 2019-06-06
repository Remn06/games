import { CollisionsPrcessor } from './physics/collisions-prcessor';
import { GameScene } from './game-structure/game-scene';
import { TransformCalculateSystem } from './core/TransformCalculateSystem';

export class GameProcessor {

	public static start(currentScene: GameScene): void {
		currentScene.gameObjects.forEach((go) => { go.start(); });
	}

	public static process(currentScene: GameScene): void {
		const gameObjects = currentScene.gameObjects.filter((g) => g.active);
		for (let i = 0; i < gameObjects.length; i++) {
			gameObjects[i].update();
		}

		TransformCalculateSystem.instance().update();

		CollisionsPrcessor.checkCollisions(gameObjects);

		for (let i = 0; i < gameObjects.length; i++) {
			gameObjects[i].draw();
		}
	}
}

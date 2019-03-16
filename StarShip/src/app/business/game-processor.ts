import { CollisionsPrcessor } from './physics/collisions-prcessor';
import { GameScene } from './game-structure/game-scene';

export class GameProcessor {
	public static process(currentScene: GameScene): void {
		const gameObjects = currentScene.gameObjects;
		for (let i = 0; i < gameObjects.length; i++) {
			gameObjects[i].update();
		}

		CollisionsPrcessor.checkCollisions(gameObjects);

		for (let i = 0; i < gameObjects.length; i++) {
			gameObjects[i].draw();
		}
	}
}

import { CollisionsPrcessor } from './physics/collisions-prcessor';
import { TransformCalculateSystem } from './core/transform-calculate-system';
import { Input } from './input/input';
import { GameObject } from './game-structure/game-object';

export class GameProcessor {

	public static process(rootGameObject: GameObject): void {

		rootGameObject.update();


		TransformCalculateSystem.instance().update();

		CollisionsPrcessor.checkCollisions(rootGameObject);

		rootGameObject.draw();

		Input.frameEnd();
	}
}

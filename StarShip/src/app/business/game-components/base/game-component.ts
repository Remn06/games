import { GameObject } from '../../game-structure/game-object';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export abstract class GameComponent {

	@Expose()
	name: string;

	@Expose()
	enabled = true;

	gameObject: GameObject;

	start(): void {
		throw new Error('Not implemented');
	}

	draw(): void {
		throw new Error('Not implemented');
	}

	update(): void {
		throw new Error('Not implemented');
	}

	destroy(): void {
		throw new Error('Not implemented');
	}
}

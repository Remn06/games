import { GameObject } from '../../../game-structure/game-object';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export abstract class GameComponent {

	public abstract name: string;

	@Expose()
	active: boolean;

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

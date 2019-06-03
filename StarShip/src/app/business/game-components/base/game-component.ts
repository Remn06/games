import { GameObject } from '../../game-structure/game-object';
import { Exclude, Expose } from 'class-transformer';

export interface IGameComponent {
	name: string;
	active: boolean;
	gameObject: GameObject;
}

@Exclude()
export abstract class GameComponent implements IGameComponent{

	@Expose()
	name: string;

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

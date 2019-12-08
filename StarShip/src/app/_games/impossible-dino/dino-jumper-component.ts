import { GameComponent } from '../../business/game-components/core/base/game-component';
import { Expose } from 'class-transformer';

class A {
	count: number;
	instances: B;
}

class B {
	number: number;
	linkToA: A;
}

export class DinoJumperComponent extends GameComponent {
	name: string = DinoJumperComponent.name;

	@Expose()
	speed: number;


	start(): void {
	}

	draw(): void {
	}

	update(): void {
		const a = this.gameObject.transform;
	}

	destroy(): void {
	}

}

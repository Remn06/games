import { Exclude, Expose } from 'class-transformer';
import { GameComponent } from './base/game-component';

@Exclude()
export class ResetToLeftComponent extends GameComponent {

	start(): void {
	}

	draw(): void {
	}

	update(): void {
		if (this.gameObject.transform.position.x > 1920) {
			this.gameObject.transform.position.x = 50;
		}
	}

	destroy(): void {
	}
}


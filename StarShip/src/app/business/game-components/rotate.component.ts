import { Exclude } from 'class-transformer';
import { GameComponent } from './base/game-component';
import { Timer } from '../common/timer';
import { VMath } from '../common/v-math';

@Exclude()
export class RotateComponent extends GameComponent {

	public rotation = 90;

	start(): void {
	}

	draw(): void {
	}

	update(): void {
		const angle = this.rotation * Timer.delta;
		this.gameObject.transform.localRotation += angle;
		this.gameObject.transform.localPosition = VMath.rotate(this.gameObject.transform.localPosition, angle);
	}

	destroy(): void {
	}
}

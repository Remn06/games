import { GameComponent } from '../../business/game-components/core/base/game-component';
import { Vector2 } from '../../business/common/vector2';
import { Timer } from '../../business/common/timer';
import { Screen } from '../../business/screen/screen';

export class CloudShifterComponent extends GameComponent {
	name: string = CloudShifterComponent.name;

	speed: number;

	start(): void {
	}

	draw(): void {
	}

	update(): void {
		const position = this.gameObject.transform.localPosition;
		const newPosition = new Vector2(position.x - this.speed * Timer.delta, position.y);
		if (newPosition.x <= 0) {
			newPosition.x = Screen.getDefaultScreen().width;
		}
		this.gameObject.transform.localPosition = newPosition;
	}

	destroy(): void {
	}
}

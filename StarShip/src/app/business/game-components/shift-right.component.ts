import { Exclude, Expose } from 'class-transformer';
import { GameComponent } from './base/game-component';
import { Timer } from '../common/Timer';
import { HtmlRendererGameComponent } from './html-renderer-game-component/html-renderer-game-component';
import { ComponentsRegistry } from './base/components-registry';

@Exclude()
export class ShiftRightComponent extends GameComponent {

	@Expose()
	public speed = null;

	start(): void {
	}

	draw(): void {
	}

	update(): void {
		this.gameObject.transform.position.x += this.speed * Timer.delta;
	}

	destroy(): void {
	}
}


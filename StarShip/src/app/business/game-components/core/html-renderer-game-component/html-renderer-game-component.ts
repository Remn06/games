import { GameObject } from '../../../game-structure/game-object';
import { GameComponent } from '../base/game-component';
import { Exclude, Expose } from 'class-transformer';
import { GameObjectRenderInfo } from './game-object-render-info';

@Exclude()
export class HtmlRendererGameComponent extends GameComponent {

	@Expose()
	public name = 'HtmlRendererGameComponent';

	@Expose()
	public backgroundImage: string;

	public gameObject: GameObject;

	public renderInfo: GameObjectRenderInfo;

	constructor() {
		super();
	}

	start(): void {
		this.renderInfo = GameObjectRenderInfo.fromGameObject(this.gameObject);
	}

	draw(): void {
		this.renderInfo.height = this.gameObject.transform.height;
		this.renderInfo.width = this.gameObject.transform.width;
		this.renderInfo.left = this.gameObject.transform.position.x - (this.gameObject.transform.width / 2);
		this.renderInfo.top = this.gameObject.transform.position.y - (this.gameObject.transform.height / 2);
		this.renderInfo.rotation = this.gameObject.transform.rotation;
		this.renderInfo.backgroundImage = this.backgroundImage;
		this.renderInfo.text = this.gameObject.text;
	}

	update(): void {
	}

	destroy(): void {
	}
}


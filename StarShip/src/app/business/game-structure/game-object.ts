import { Exclude, Expose, Transform as TransformAttr, Type } from 'class-transformer';
import { Transform } from './transform';
import { GameComponent } from '../game-components/core/base/game-component';
import { ComponentBuilder } from '../game-loader/component-builder';
import { HtmlRendererGameComponent } from '../game-components/core/html-renderer-game-component/html-renderer-game-component';

@Exclude()
export class GameObject {

	@Expose()
	public name: string = null;

	@Expose()
	@TransformAttr(value => ComponentBuilder.build(value), {toClassOnly: true})
	public components: GameComponent[] = [];

	@Expose()
	@Type(() => Transform)
	public transform: Transform = new Transform();

	@Expose()
	@Type(() => GameObject)
	public children: GameObject[] = [];

	@Expose()
	@Type(() => GameObject)
	public parent: GameObject = null;

	@Expose()
	public text: string;

	@Expose()
	public active: boolean;

	constructor() {
	}

	public getComponent(componentName: string): GameComponent {
		return this.components.find((c) => c.name === componentName);
	}

	start(): void {
		if (this.components.length === 0) {
			const component = new HtmlRendererGameComponent();
			component.name = 'HtmlRendererGameComponent';
			component.gameObject = this;
			this.components.push(component);
		}

		this.components.forEach(
			(component) => {
				component.start();
			}
		);

		this.children.forEach((ch) => {
			ch.start();
		});
	}

	draw() {
		this.components.forEach(
			(component) => {
				component.draw();
			}
		);

		this.children.forEach((ch) => {
			ch.draw();
		});
	}

	update() {
		this.components.forEach(
			(component) => {
				component.update();
			}
		);

		this.children.forEach((ch) => {
			ch.update();
		});
	}

	destroy() {
		this.components.forEach(
			(component) => {
				component.destroy();
			}
		);

		this.children.forEach((ch) => {
			ch.destroy();
		});
	}
}

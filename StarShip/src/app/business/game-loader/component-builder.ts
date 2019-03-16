import { GameComponent } from '../game-components/base/game-component';
import { ComponentsRegistry } from '../game-components/base/components-registry';
import { plainToClass } from 'class-transformer';

export class ComponentBuilder {

	public static build(component: GameComponent[]): GameComponent[] {
		if (component == null) {
			return null;
		}
		return component.map((c) => {
			const factory = ComponentsRegistry.registry.get(c.name);
			return plainToClass(factory(), component) as any;
		});
	}
}

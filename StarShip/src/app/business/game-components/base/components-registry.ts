import { SimpleMoveGameComponent } from '../simple-move-game-component';
import { HtmlRendererGameComponent } from '../html-renderer-game-component/html-renderer-game-component';
import { ShiftRightComponent } from '../shift-right.component';
import { ResetToLeftComponent } from '../reset-to-left.component';
import { RotateComponent } from '../rotate.component';

export class ComponentsRegistry {
	public static registry = new Map<string, () => any>();
}

ComponentsRegistry.registry.set('ShiftRightComponent', () => ShiftRightComponent);
ComponentsRegistry.registry.set('SimpleMoveGameComponent', () => SimpleMoveGameComponent);
ComponentsRegistry.registry.set('HtmlRendererGameComponent', () => HtmlRendererGameComponent);
ComponentsRegistry.registry.set('ResetToLeftComponent', () => ResetToLeftComponent);
ComponentsRegistry.registry.set('RotateComponent', () => RotateComponent);


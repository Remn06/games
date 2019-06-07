export interface IInputAdapter {
	key: Set<string>;
	keyUp: Set<string>;
	keyDown: Set<string>;

	frameEnd(): void;
}

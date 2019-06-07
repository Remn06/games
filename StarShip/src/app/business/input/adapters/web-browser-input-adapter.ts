import { AbstractInputAdapter } from './abstract-input-adapter';

export class WebBrowserInputAdapter extends AbstractInputAdapter {

	constructor(private document: Document) {
		super();
		this.initEvents();
	}

	public frameEnd(): void {
		this.keyDown.clear();
		this.keyUp.clear();
	}

	private initEvents(): void {
		this.document.addEventListener('keydown', (event: KeyboardEvent) => this.onKeyDown(event) );
		this.document.addEventListener('keyup', (event: KeyboardEvent) => this.onKeyUp(event) );
	}

	private onKeyDown(event: KeyboardEvent): void {
		this.keyDown.add(event.code);
		this.key.add(event.code);
		console.log(`keyDown ${event.code}`);
	}

	private onKeyUp(event: KeyboardEvent): void {
		this.keyUp.add(event.code);
		this.key.delete(event.code);
		console.log(`keyUp ${event.code}`);
	}

}

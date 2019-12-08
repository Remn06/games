import { Component, HostListener, Inject, Injectable, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Input } from '../../business/input/input';
import { WebBrowserInputAdapter } from '../../business/input/adapters/web-browser-input-adapter';
import { GameScreen } from '../../business/screen/game-screen';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
@Injectable()
export class AppComponent implements OnInit {

	width = '100px';
	height = '100px';

	constructor(@Inject(DOCUMENT) private document: Document) {
	}

	@HostListener('window:resize', [])
	onResize() {
		const margin = 100;

		const screen = GameScreen.getDefaultScreen();
		screen.width = window.innerWidth - margin;
		screen.height = window.innerHeight - margin;

		this.width = `${window.innerWidth - margin}px`;
		this.height = `${window.innerHeight - margin}px`;
	}

	ngOnInit() {
		setTimeout(() => {
			this.onResize();
		}, 0);
		Input.setAdapter(new WebBrowserInputAdapter(this.document));
	}
}

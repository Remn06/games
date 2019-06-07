import { Component, HostListener, Inject, Injectable, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Input } from '../../business/input/input';
import { WebBrowserInputAdapter } from '../../business/input/adapters/web-browser-input-adapter';

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
		this.width = `${window.innerWidth - 100}px`;
		this.height = `${window.innerHeight - 100}px`;
	}

	ngOnInit() {
		setTimeout(() => {
			this.onResize();
		}, 0);
		Input.setAdapter(new WebBrowserInputAdapter(this.document));
	}
}

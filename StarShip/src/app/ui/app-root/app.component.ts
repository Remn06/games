import { Component, HostListener, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

	width = '100px';
	height = '100px';

	@HostListener('window:resize', [])
	onResize() {
		this.width = `${window.innerWidth - 100}px`;
		this.height = `${window.innerHeight - 100}px`;
	}

	ngOnInit() {
		setTimeout(() => {
			this.onResize();
		}, 0);
	}
}

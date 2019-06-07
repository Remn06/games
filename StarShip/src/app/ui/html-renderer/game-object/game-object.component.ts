import { Component, Input, OnInit } from '@angular/core';
import { GameObjectRenderInfo } from '../../../business/game-components/core/html-renderer-game-component/game-object-render-info';

@Component({
	selector: 'app-game-object',
	templateUrl: './game-object.component.html',
	styleUrls: ['./game-object.component.less']
})
export class GameObjectComponent implements OnInit {

	@Input()
	gameObjectRenderInfo: GameObjectRenderInfo;

	constructor() {
	}

	ngOnInit() {
	}

	getStyle(): any {
		return {
			width: this.gameObjectRenderInfo.width + 'px',
			height: this.gameObjectRenderInfo.height + 'px',
			left: this.gameObjectRenderInfo.left + 'px',
			top: this.gameObjectRenderInfo.top + 'px',
			transform: `rotate(${this.gameObjectRenderInfo.rotation}deg)`,
			'background-image': this.gameObjectRenderInfo.backgroundImage
		};
	}

}

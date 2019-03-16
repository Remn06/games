import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { HtmlRendererService } from '../html-renderer/html-renderer.service';
import { GameObjectRenderInfo } from '../../business/game-components/html-renderer-game-component/game-object-render-info';
import { Subject, Subscription } from 'rxjs';
import { Logger } from '../../business/common/logger';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent implements OnDestroy, OnInit {

	gameObjectsRenderInfos: GameObjectRenderInfo[] = [];
	width = '100px';
	height = '100px';

	private subscription: Subscription = null;

	constructor(private htmlRendererService: HtmlRendererService, private changeDetectorRef: ChangeDetectorRef) {
	}

	@HostListener('window:resize', [])
	onResize() {
		this.width = `${window.innerWidth - 100}px`;
		this.height = `${window.innerHeight - 100}px`;
	}

	ngOnInit(): void {
		setTimeout(() => {
			this.onResize();
		}, 0);
		this.subscribeToGameObjects();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	private subscribeToGameObjects(): void {
		this.subscription = this.htmlRendererService.getGameObjectsRenderInfos().subscribe(gameObjectsRenderInfos => {
			this.gameObjectsRenderInfos = gameObjectsRenderInfos;
			this.changeDetectorRef.detectChanges();
		});
	}

}

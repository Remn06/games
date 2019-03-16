import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { GameObjectRenderInfo } from '../../business/game-components/html-renderer-game-component/game-object-render-info';
import { GameManager } from '../../business/game-manager';
import { GameScene } from '../../business/game-structure/game-scene';
import { HtmlRendererGameComponent } from '../../business/game-components/html-renderer-game-component/html-renderer-game-component';
import { EventMessage, EventMessageType } from '../../business/events/event-message';

@Injectable({
	providedIn: 'root'
})
export class HtmlRendererService implements OnDestroy {
	private subject = new BehaviorSubject<GameObjectRenderInfo[]>([]);
	private gameCalculatedSubscription: Subscription;

	constructor() {
		GameManager.instance().gameEvents().subscribe((eventMessage) => {
			this.processEvent(eventMessage);
		});
	}

	ngOnDestroy(): void {
		this.gameCalculatedSubscription.unsubscribe();
		this.subject.complete();
	}

	public getGameObjectsRenderInfos(): Subject<GameObjectRenderInfo[]> {
		return this.subject;
	}

	private render(gameScene: GameScene): void {
		const infos = gameScene.gameObjects.map((go) => {
			const renderer = go.getComponent('HtmlRendererGameComponent') as HtmlRendererGameComponent;
			if (renderer == null) {
				return;
			}
			return renderer.renderInfo;
		});
		this.subject.next(infos);
	}

	private processEvent(eventMessage: EventMessage): void {
		switch (eventMessage.type) {
			case EventMessageType.GameUpdate:
				this.render(eventMessage.data as GameScene);
				break;
			default:
		}
	}
}

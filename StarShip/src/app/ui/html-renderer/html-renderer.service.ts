import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { GameObjectRenderInfo } from '../../business/game-components/html-renderer-game-component/game-object-render-info';
import { GameScene } from '../../business/game-structure/game-scene';
import { HtmlRendererGameComponent } from '../../business/game-components/html-renderer-game-component/html-renderer-game-component';
import { EventMessage, EventMessageType } from '../../business/events/event-message';
import { GameObject } from '../../business/game-structure/game-object';
import { GameEventManager } from '../../business/game-event-manager';

@Injectable({
	providedIn: 'root'
})
export class HtmlRendererService implements OnDestroy {
	private subject = new BehaviorSubject<GameObjectRenderInfo[]>([]);
	private gameCalculatedSubscription: Subscription;

	constructor() {
		GameEventManager.events().subscribe((eventMessage) => {
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

		const allObjects = this.getAllGameObjects(gameScene.gameObjects);

		const infos = allObjects.map((go) => {
			const renderer = go.getComponent('HtmlRendererGameComponent') as HtmlRendererGameComponent;
			if (renderer == null) {
				return;
			}
			return renderer.renderInfo;
		});
		this.subject.next(infos);
	}

	private getAllGameObjects(gameObjects: GameObject[]): GameObject[] {
		let res = [];
		gameObjects.forEach((go) => {
			if (!go.active) {
				return;
			}
			res.push(go)
			const children = this.getAllGameObjects(go.children);
			res = res.concat(children);
		});
		return res;
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

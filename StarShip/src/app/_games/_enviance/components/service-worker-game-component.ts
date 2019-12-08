import { GameComponent } from '../../../business/game-components/core/base/game-component';
import { JiraIssueFacade } from '../business/jira/jira-issue-facade';

export class ServiceWorkerGameComponent extends GameComponent  {

	name: string = ServiceWorkerGameComponent.name;

	public draw() {
	}

	public start() {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('./sw.js')
				.then((reg) => {
					// registration worked
					console.log('Registration succeeded. Scope is ' + reg.scope);
				}).catch((error) => {
				// registration failed
				console.log('Registration failed with ' + error);
			});
		}
	}

	public update() {
	}

	public destroy() {
	}
}

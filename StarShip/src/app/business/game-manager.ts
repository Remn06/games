import { GameLoader } from './game-loader/game-loader';
import { GameData } from './game-structure/game-data';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { EventMessage, EventMessageType } from './events/event-message';
import { Timer } from './common/Timer';
import { GameProcessor } from './game-processor';
import { Logger } from './common/logger';

export class GameManager {
	private static gameManagerInstance: GameManager = null;

	private gameData: GameData = null;
	private currentScene = null;
	private timerSubscription: Subscription = null;

	private onGameEventSubject = new BehaviorSubject<EventMessage>(EventMessage.empty());

	/*private gameMenu: GameMenu = null;
	private gameEngine: GameEngine = null;
	private gameController: GameController = null;
	private isStarted = false;*/

	public static instance(): GameManager {
		if (GameManager.gameManagerInstance == null) {
			GameManager.gameManagerInstance = new GameManager();
		}
		return GameManager.gameManagerInstance;
	}

	constructor() {
		setTimeout(() => this.load(), 0);
	}

	public load(): void {
		// todo all this have to be refactored.
		this.gameData = GameLoader.load();
		this.currentScene = this.gameData.scenes.find((s) => s.name === this.gameData.defaultSceneName);
		this.gameData.scenes[0].gameObjects.forEach((go) => { go.start(); });
		if (this.timerSubscription) {
			this.timerSubscription.unsubscribe();
		}
		this.timerSubscription = Timer.timerEvent.subscribe(() => this.timerEventProcessor());
		this.onGameEventSubject.next(new EventMessage(EventMessageType.GameStarted, this.currentScene.gameObjects));
	}

	public gameEvents(): Subject<EventMessage> {
		return this.onGameEventSubject;
	}

	public destroy(): void {
		this.onGameEventSubject.complete();
		if (this.timerSubscription) {
			this.timerSubscription.unsubscribe();
		}
	}

	private timerEventProcessor(): void {
		GameProcessor.process(this.currentScene);
		this.onGameEventSubject.next(new EventMessage(EventMessageType.GameUpdate, this.currentScene));
	}

/*
	  public start() {
		  this.gameMenu = new GameMenu();
		  this.gameEngine = new GameEngine();
		  this.gameController = new GameController();
		  this.gameMenu.showMenu(this.gameEngine.isGameStarted());
	  }

	  public startNewGame() {
		  this.isStarted = true;
		  this.gameMenu.hideMenu();
		  this.gameEngine.startNewGame();
	  }

	  public pauseGame() {
		  this.gameEngine.pauseGame();
		  this.gameMenu.showMenu(this.gameEngine.isGameStarted());
	  }

	  public resumeGame() {
		  this.gameMenu.hideMenu();
		  this.gameEngine.resumeGame();
	  }

	  public onAction(action: Action) {
		  this.gameEngine.onAction(action);
	  }

	  public addGameObject(gameObject: GameObject) {
		  this.gameEngine.addGameObject(gameObject);
	  }

	  public removeGameObject(gameObject: GameObject) {
		  this.gameEngine.removeGameObject(gameObject);
	  }

	  public isInsideGameArea(gameObject: GameObject): boolean {
		  return this.gameEngine.isInsideGameArea(gameObject);
	  }

	  public getScore() {
		  return this.gameEngine.getScore();
	  }

	  public getLives() {
		  return this.gameEngine.getLives();
	  }
	  */
}





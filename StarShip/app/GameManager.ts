class GameManager {
    gameMenu: GameMenu = null;
    gameEngine: GameEngine = null;
    gameController: GameController = null;
    isStarted: boolean = false;

    private static gameManagerInstance: GameManager = null;

    public static instance(): GameManager {
        if(GameManager.gameManagerInstance == null) {
            GameManager.gameManagerInstance = new GameManager();
        }
        return GameManager.gameManagerInstance;

    }

    start() {
        this.gameMenu = new GameMenu();
        this.gameEngine = new GameEngine();
        this.gameController = new GameController();
        this.gameMenu.showMenu(this.gameEngine.isGameStarted());
    }

    startNewGame() {
        this.isStarted = true;
        this.gameMenu.hideMenu();
        this.gameEngine.startNewGame();
    }

    pauseGame() {
        this.gameEngine.pauseGame();
        this.gameMenu.showMenu(this.gameEngine.isGameStarted());
    }

    resumeGame() {
        this.gameMenu.hideMenu();
        this.gameEngine.resumeGame();
    }

    onAction(action: Action) {
        this.gameEngine.onAction(action);
    }

    addGameObject(gameObject: GameObject) {
        this.gameEngine.addGameObject(gameObject);
    }

    removeGameObject(gameObject: GameObject) {
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

}





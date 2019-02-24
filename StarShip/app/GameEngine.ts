class GameEngine {
    
    gameObjects: GameObject[] = null;
    isStarted: boolean = false;
    timerHandle: any = null;
    gameArea = $('#gameArea');
    private score: number = null;
    private lives: number = null;

    constructor() {
        let self = this;
        $(window).resize(function () {
            self.onWindowResize();
        });

        this.onWindowResize();
    }

    startNewGame() {

        this.gameArea.empty();

        this.isStarted = true;
        this.gameObjects = [];

        this.score = 0;
        this.lives = 5;

        this.createStarShip();
        this.createAsteroids(5);
        //this.createScoreIndicator();
        this.createLivesIndicator();
        this.startTimer();

        const loadedObjects = GameLoader.load(
            {
                scenes: [ {
                    name: 'StarShip Scene',
                    gameObjects: [{
                        name: 'ScoreIndicator',
                        transform: {
                            width: 100,
                            height: 100,
                            left: 10,
                            top: 10
                        },
                        components: [
                            {
                                name: 'HtmlRenderer',
                                data: [{name: 'className', value: 'scoreIndicator'}]
                            },
                            {
                                name: 'ScoreIndicator',
                                data: []
                            }
                        ]
                    }]
                }
                ]
            }
        );

        loadedObjects.forEach((gameObject) => {
            this.addGameObject(gameObject);
        });
    }

    addGameObject (gameObject: GameObject) {
        gameObject.start();
        this.gameObjects.push(gameObject);
    }

    removeGameObject (gameObject: GameObject) {
        for(let i = 0; i < this.gameObjects.length; i++) {
            if(this.gameObjects[i] === gameObject) {
                this.gameObjects[i].destroy();
                this.gameObjects.splice(i, 1);
                break;
            }
        }
    }

    pauseGame() {
        this.stopTimer();
    }

    resumeGame() {
        this.startTimer();
    }

    startTimer() {
        for(let i = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].update();
        }

        this.checkCollisions();

        for(let i = 0; i < this.gameObjects.length; i++){
            this.gameObjects[i].draw();
        }

        let self = this;

        this.timerHandle = setTimeout(function() {
            self.startTimer();
        }, 16);
    }

    stopTimer() {
        if(this.timerHandle != null) {
            clearTimeout(this.timerHandle);
            this.timerHandle = null;
        }
    }

    isGameStarted() {
        return this.isStarted;
    }

    onAction(action: Action) {
        if(action === Action.left || action === Action.right ||
            action === Action.forward || action === Action.backward || action === Action.fire) {
            const starShip = this.findStarShip();
            if(starShip != null) {
                starShip.onAction(action);
            }
        }
    }

    findStarShip(): StarShip {
        for(let i = 0; i < this.gameObjects.length; i++){
            if(this.gameObjects[i] instanceof StarShip){
                return this.gameObjects[i] as StarShip;
            }
        }
        return null;
    }

    onWindowResize() {
        this.gameArea.css({
            'width': ($(window).width() - 100) + 'px' ,
            'height': ($(window).height() - 100) + 'px'
        });
    }

    createAsteroids(amount: number) {
        for(let i = 0; i < amount; i++) {
            let asteroid = new Asteroid();
            asteroid.checkCollision = false;
            asteroid.speed = this.getRandom(1, 3);
            this.calcAsteroidPos(asteroid);
            GameManager.instance().addGameObject(asteroid);
        }
    }

    createStarShip(): void {
        let s = new StarShip();
        s.transform.left = this.gameArea.width() / 2 - s.transform.width / 2;
        s.transform.top = this.gameArea.height() / 2 - s.transform.height / 2;
        s.checkCollision = false;
        this.addGameObject(s);
    }

    createGameOverObject(): void {
        let gameOver = new GameOverObject();
        gameOver.transform.left = this.gameArea.width() / 2 - gameOver.transform.width / 2;
        gameOver.transform.top = this.gameArea.height() / 2 - gameOver.transform.height / 2;
        this.addGameObject(gameOver);
    }

   /* private createScoreIndicator(): void {
        let scoreIndicator = new ScoreIndicator();
        scoreIndicator.left = 10;
        scoreIndicator.top = 10;
        this.addGameObject(scoreIndicator);
    }*/

    private createLivesIndicator(): void {
        let livesObject = new LivesObject();
        livesObject.transform.left = 100;
        livesObject.transform.top = 10;
        this.addGameObject(livesObject);
    }

    calcAsteroidPos(asteroid: Asteroid): void{
        let gameAreaWidth = this.gameArea.width();
        let gameAreaHeight = this.gameArea.height();

        let side = this.getRandom(0, 3);

        switch (side) {
            case 0:
                asteroid.transform.top = 0 - asteroid.transform.height;
                break;
            case 1:
                asteroid.transform.left = gameAreaWidth;
                break;
            case 2:
                asteroid.transform.top = gameAreaHeight;
                break;
            case 3:
                asteroid.transform.left = 0 - asteroid.transform.width;
                break;
            default:
        }

        switch (side) {
            case 0:
            case 2:
                asteroid.transform.left = this.getRandom(0, gameAreaWidth - asteroid.transform.width - 1);
                break;
            case 1:
            case 3:
                asteroid.transform.top = this.getRandom(0, gameAreaHeight - asteroid.transform.height - 1);
                break;
            default:
        }

        switch (side) {
            case 0:
                if(asteroid.transform.left < gameAreaWidth / 2) {
                    asteroid.direction = MovingObjectDirection.southeast;
                } else {
                    asteroid.direction = MovingObjectDirection.southwest;
                }
                break;
            case 1:
                if(asteroid.transform.top < gameAreaHeight / 2) {
                    asteroid.direction = MovingObjectDirection.southwest;
                } else {
                    asteroid.direction = MovingObjectDirection.northwest;
                }
                break;
            case 2:
                if(asteroid.transform.left < gameAreaWidth / 2) {
                    asteroid.direction = MovingObjectDirection.northeast;
                } else {
                    asteroid.direction = MovingObjectDirection.northwest;
                }
                break;
            case 3:
                if(asteroid.transform.top < gameAreaHeight / 2) {
                    asteroid.direction = MovingObjectDirection.southeast;
                } else {
                    asteroid.direction = MovingObjectDirection.northeast;
                }
                break;
            default:
        }
    }

    getRandom(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    checkCollisions(): void {
        let intersectObjects: IntersectObject[] = [];
        for(let i = 0; i < this.gameObjects.length; i++){
            if(this.gameObjects[i] instanceof IntersectObject){
                intersectObjects.push(this.gameObjects[i] as IntersectObject);
            }
        }

        let result: GameObject[] = [];
        for(let i = 0; i < intersectObjects.length; i++) {
            let intersectObject = intersectObjects[i];
            for(let t = i + 1; t < intersectObjects.length; t++) {
                let intersectObject1 = intersectObjects[t];
                if(intersectObject.checkCollision === false || intersectObject1.checkCollision === false) {
                    continue;
                }
                if( intersectObject.intersects(intersectObject1) || intersectObject1.intersects(intersectObject) ) {
                    result.push(intersectObject1);
                    result.push(intersectObject);
                    this.objectsCollide(intersectObject, intersectObject1);
                }
            }
        }

        for(let i = 0; i < result.length; i++){
            GameManager.instance().removeGameObject(result[i]);

            let animatedObject = new AnimatedObject('./img/explosion-sprite.png', 100, 100, 74, 9, 1000, true, () => {
                this.removeGameObject(animatedObject);
            });
            animatedObject.transform.left = result[i].transform.left;
            animatedObject.transform.top = result[i].transform.top;
            animatedObject.transform.width = 25;
            animatedObject.transform.height = 25;
            this.addGameObject(animatedObject);
        }

        this.restoreAsteroidsAmount(result);
        this.checkIfCruiserDeleted(result);
    }

    public objectsCollide(gameObj: GameObject, gameObj1: GameObject) {
        let haveAsteroid = (gameObj instanceof Asteroid) || (gameObj1 instanceof Asteroid);
        let haveBullet = (gameObj instanceof Bullet) || (gameObj1 instanceof Bullet);
        if(haveAsteroid === true && haveBullet === true) {
            this.score = this.score + 10;
        }
    }

    public isInsideGameArea(gameObject: GameObject): boolean {
        let gameAreaWidth = this.gameArea.width();
        let gameAreaHeight = this.gameArea.height();
        let goRight = gameObject.transform.left + gameObject.transform.width;
        let goBottom = gameObject.transform.top + gameObject.transform.height;

        return (
            gameObject.transform.left > 0 && gameObject.transform.left < gameAreaWidth &&
            gameObject.transform.top > 0 && gameObject.transform.top < gameAreaHeight &&
            goRight > 0 && goRight < gameAreaWidth &&
            goBottom > 0 && goBottom < gameAreaHeight
           )
    }

    public getScore(): number {
        return this.score;
    }

    public getLives(): number {
        return this.lives;
    }

    public checkIfCruiserDeleted(removedObjects: GameObject[]): void {
        if(removedObjects.length === 0) {
            return;
        }

        let isDeleted: boolean = false;

        for(let i = 0; i < removedObjects.length; i++){
            if(removedObjects[i] instanceof StarShip) {
                isDeleted = true;
                break;
            }
        }

        if(isDeleted === true) {
            this.lives--;
            if(this.lives > 0) {
                this.createStarShip();
            } else {
                this.createGameOverObject();
            }
        }
    }

    private restoreAsteroidsAmount(removedObjects: GameObject[]): void {
        if(removedObjects.length === 0) {
            return;
        }

        let amountOfAsteroids = 0;

        for(let i = 0; i < removedObjects.length; i++){
            if(removedObjects[i] instanceof Asteroid) {
                amountOfAsteroids++;
            }

        }

        this.createAsteroids(amountOfAsteroids);
    }
}

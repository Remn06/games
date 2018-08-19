class GameEngine {
    
    gameObjects: GameObject[] = null;
    isStarted: boolean = false;
    timerHandle: any = null;
    gameArea = $('#gameArea');
    private score: number = null;

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

        this.createStarShip();
        this.createAsteroids(5);
        this.createScoreIndicator();
        this.startTimer();
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
            (this.gameObjects[0] as StarShip).onAction(action);

        }
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
        s.left = this.gameArea.width() / 2 - s.width / 2;
        s.top = this.gameArea.height() / 2 - s.height / 2;
        s.checkCollision = false;
        this.addGameObject(s);
    }

    private createScoreIndicator(): void {
        let scoreIndicator = new ScoreIndicator();
        scoreIndicator.left = 10;
        scoreIndicator.top = 10;
        this.addGameObject(scoreIndicator);
    }

    calcAsteroidPos(asteroid: Asteroid): void{
        let gameAreaWidth = this.gameArea.width();
        let gameAreaHeight = this.gameArea.height();

        let side = this.getRandom(0, 3);

        switch (side) {
            case 0:
                asteroid.top = 0 - asteroid.height;
                break;
            case 1:
                asteroid.left = gameAreaWidth;
                break;
            case 2:
                asteroid.top = gameAreaHeight;
                break;
            case 3:
                asteroid.left = 0 - asteroid.width;
                break;
            default:
        }

        switch (side) {
            case 0:
            case 2:
                asteroid.left = this.getRandom(0, gameAreaWidth - asteroid.width - 1);
                break;
            case 1:
            case 3:
                asteroid.top = this.getRandom(0, gameAreaHeight - asteroid.height - 1);
                break;
            default:
        }

        switch (side) {
            case 0:
                if(asteroid.left < gameAreaWidth / 2) {
                    asteroid.direction = MovingObjectDirection.southeast;
                } else {
                    asteroid.direction = MovingObjectDirection.southwest;
                }
                break;
            case 1:
                if(asteroid.top < gameAreaHeight / 2) {
                    asteroid.direction = MovingObjectDirection.southwest;
                } else {
                    asteroid.direction = MovingObjectDirection.northwest;
                }
                break;
            case 2:
                if(asteroid.left < gameAreaWidth / 2) {
                    asteroid.direction = MovingObjectDirection.northeast;
                } else {
                    asteroid.direction = MovingObjectDirection.northwest;
                }
                break;
            case 3:
                if(asteroid.top < gameAreaHeight / 2) {
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
            animatedObject.left = result[i].left;
            animatedObject.top = result[i].top;
            animatedObject.width = 25;
            animatedObject.height = 25;
            this.addGameObject(animatedObject);
        }

        this.restoreAsteroidsAmount(result);
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
        let goRight = gameObject.left + gameObject.width;
        let goBottom = gameObject.top + gameObject.height;

        return (
            gameObject.left > 0 && gameObject.left < gameAreaWidth &&
            gameObject.top > 0 && gameObject.top < gameAreaHeight &&
            goRight > 0 && goRight < gameAreaWidth &&
            goBottom > 0 && goBottom < gameAreaHeight
           )
    }

    public getScore(): number {
        return this.score;
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

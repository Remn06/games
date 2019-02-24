var MovingObjectDirection;
(function (MovingObjectDirection) {
    MovingObjectDirection[MovingObjectDirection["north"] = 0] = "north";
    MovingObjectDirection[MovingObjectDirection["northeast"] = 1] = "northeast";
    MovingObjectDirection[MovingObjectDirection["east"] = 2] = "east";
    MovingObjectDirection[MovingObjectDirection["southeast"] = 3] = "southeast";
    MovingObjectDirection[MovingObjectDirection["south"] = 4] = "south";
    MovingObjectDirection[MovingObjectDirection["southwest"] = 5] = "southwest";
    MovingObjectDirection[MovingObjectDirection["west"] = 6] = "west";
    MovingObjectDirection[MovingObjectDirection["northwest"] = 7] = "northwest";
})(MovingObjectDirection || (MovingObjectDirection = {}));
var Action;
(function (Action) {
    Action[Action["left"] = "left"] = "left";
    Action[Action["right"] = "right"] = "right";
    Action[Action["forward"] = "forward"] = "forward";
    Action[Action["backward"] = "backward"] = "backward";
    Action[Action["fire"] = "fire"] = "fire";
})(Action || (Action = {}));
var main = (function () {
    function main() {
        this.i = 0;
    }
    return main;
}());
var GameController = (function () {
    function GameController() {
        this.init();
    }
    GameController.prototype.init = function () {
        $(document).on('keydown', function (event) {
            if (event.keyCode === 27) {
                GameManager.instance().pauseGame();
                return;
            }
            if (event.keyCode === 65) {
                GameManager.instance().onAction(Action.left);
                return;
            }
            if (event.keyCode === 68) {
                GameManager.instance().onAction(Action.right);
                return;
            }
            if (event.keyCode === 87) {
                GameManager.instance().onAction(Action.forward);
                return;
            }
            if (event.keyCode === 83) {
                GameManager.instance().onAction(Action.backward);
                return;
            }
            if (event.keyCode === 32) {
                GameManager.instance().onAction(Action.fire);
                return;
            }
        });
    };
    ;
    return GameController;
}());
var GameEngine = (function () {
    function GameEngine() {
        this.gameObjects = null;
        this.isStarted = false;
        this.timerHandle = null;
        this.gameArea = $('#gameArea');
        this.score = null;
        this.lives = null;
        var self = this;
        $(window).resize(function () {
            self.onWindowResize();
        });
        this.onWindowResize();
    }
    GameEngine.prototype.startNewGame = function () {
        var _this = this;
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
        var loadedObjects = GameLoader.load({
            scenes: [{
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
                                    data: [{ name: 'className', value: 'scoreIndicator' }]
                                },
                                {
                                    name: 'ScoreIndicator',
                                    data: []
                                }
                            ]
                        }]
                }
            ]
        });
        loadedObjects.forEach(function (gameObject) {
            _this.addGameObject(gameObject);
        });
    };
    GameEngine.prototype.addGameObject = function (gameObject) {
        gameObject.start();
        this.gameObjects.push(gameObject);
    };
    GameEngine.prototype.removeGameObject = function (gameObject) {
        for (var i = 0; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i] === gameObject) {
                this.gameObjects[i].destroy();
                this.gameObjects.splice(i, 1);
                break;
            }
        }
    };
    GameEngine.prototype.pauseGame = function () {
        this.stopTimer();
    };
    GameEngine.prototype.resumeGame = function () {
        this.startTimer();
    };
    GameEngine.prototype.startTimer = function () {
        for (var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update();
        }
        this.checkCollisions();
        for (var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].draw();
        }
        var self = this;
        this.timerHandle = setTimeout(function () {
            self.startTimer();
        }, 16);
    };
    GameEngine.prototype.stopTimer = function () {
        if (this.timerHandle != null) {
            clearTimeout(this.timerHandle);
            this.timerHandle = null;
        }
    };
    GameEngine.prototype.isGameStarted = function () {
        return this.isStarted;
    };
    GameEngine.prototype.onAction = function (action) {
        if (action === Action.left || action === Action.right ||
            action === Action.forward || action === Action.backward || action === Action.fire) {
            var starShip = this.findStarShip();
            if (starShip != null) {
                starShip.onAction(action);
            }
        }
    };
    GameEngine.prototype.findStarShip = function () {
        for (var i = 0; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i] instanceof StarShip) {
                return this.gameObjects[i];
            }
        }
        return null;
    };
    GameEngine.prototype.onWindowResize = function () {
        this.gameArea.css({
            'width': ($(window).width() - 100) + 'px',
            'height': ($(window).height() - 100) + 'px'
        });
    };
    GameEngine.prototype.createAsteroids = function (amount) {
        for (var i = 0; i < amount; i++) {
            var asteroid = new Asteroid();
            asteroid.checkCollision = false;
            asteroid.speed = this.getRandom(1, 3);
            this.calcAsteroidPos(asteroid);
            GameManager.instance().addGameObject(asteroid);
        }
    };
    GameEngine.prototype.createStarShip = function () {
        var s = new StarShip();
        s.transform.left = this.gameArea.width() / 2 - s.transform.width / 2;
        s.transform.top = this.gameArea.height() / 2 - s.transform.height / 2;
        s.checkCollision = false;
        this.addGameObject(s);
    };
    GameEngine.prototype.createGameOverObject = function () {
        var gameOver = new GameOverObject();
        gameOver.transform.left = this.gameArea.width() / 2 - gameOver.transform.width / 2;
        gameOver.transform.top = this.gameArea.height() / 2 - gameOver.transform.height / 2;
        this.addGameObject(gameOver);
    };
    /* private createScoreIndicator(): void {
         let scoreIndicator = new ScoreIndicator();
         scoreIndicator.left = 10;
         scoreIndicator.top = 10;
         this.addGameObject(scoreIndicator);
     }*/
    GameEngine.prototype.createLivesIndicator = function () {
        var livesObject = new LivesObject();
        livesObject.transform.left = 100;
        livesObject.transform.top = 10;
        this.addGameObject(livesObject);
    };
    GameEngine.prototype.calcAsteroidPos = function (asteroid) {
        var gameAreaWidth = this.gameArea.width();
        var gameAreaHeight = this.gameArea.height();
        var side = this.getRandom(0, 3);
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
                if (asteroid.transform.left < gameAreaWidth / 2) {
                    asteroid.direction = MovingObjectDirection.southeast;
                }
                else {
                    asteroid.direction = MovingObjectDirection.southwest;
                }
                break;
            case 1:
                if (asteroid.transform.top < gameAreaHeight / 2) {
                    asteroid.direction = MovingObjectDirection.southwest;
                }
                else {
                    asteroid.direction = MovingObjectDirection.northwest;
                }
                break;
            case 2:
                if (asteroid.transform.left < gameAreaWidth / 2) {
                    asteroid.direction = MovingObjectDirection.northeast;
                }
                else {
                    asteroid.direction = MovingObjectDirection.northwest;
                }
                break;
            case 3:
                if (asteroid.transform.top < gameAreaHeight / 2) {
                    asteroid.direction = MovingObjectDirection.southeast;
                }
                else {
                    asteroid.direction = MovingObjectDirection.northeast;
                }
                break;
            default:
        }
    };
    GameEngine.prototype.getRandom = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    GameEngine.prototype.checkCollisions = function () {
        var _this = this;
        var intersectObjects = [];
        for (var i = 0; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i] instanceof IntersectObject) {
                intersectObjects.push(this.gameObjects[i]);
            }
        }
        var result = [];
        for (var i = 0; i < intersectObjects.length; i++) {
            var intersectObject = intersectObjects[i];
            for (var t = i + 1; t < intersectObjects.length; t++) {
                var intersectObject1 = intersectObjects[t];
                if (intersectObject.checkCollision === false || intersectObject1.checkCollision === false) {
                    continue;
                }
                if (intersectObject.intersects(intersectObject1) || intersectObject1.intersects(intersectObject)) {
                    result.push(intersectObject1);
                    result.push(intersectObject);
                    this.objectsCollide(intersectObject, intersectObject1);
                }
            }
        }
        var _loop_1 = function (i) {
            GameManager.instance().removeGameObject(result[i]);
            var animatedObject = new AnimatedObject('./img/explosion-sprite.png', 100, 100, 74, 9, 1000, true, function () {
                _this.removeGameObject(animatedObject);
            });
            animatedObject.transform.left = result[i].transform.left;
            animatedObject.transform.top = result[i].transform.top;
            animatedObject.transform.width = 25;
            animatedObject.transform.height = 25;
            this_1.addGameObject(animatedObject);
        };
        var this_1 = this;
        for (var i = 0; i < result.length; i++) {
            _loop_1(i);
        }
        this.restoreAsteroidsAmount(result);
        this.checkIfCruiserDeleted(result);
    };
    GameEngine.prototype.objectsCollide = function (gameObj, gameObj1) {
        var haveAsteroid = (gameObj instanceof Asteroid) || (gameObj1 instanceof Asteroid);
        var haveBullet = (gameObj instanceof Bullet) || (gameObj1 instanceof Bullet);
        if (haveAsteroid === true && haveBullet === true) {
            this.score = this.score + 10;
        }
    };
    GameEngine.prototype.isInsideGameArea = function (gameObject) {
        var gameAreaWidth = this.gameArea.width();
        var gameAreaHeight = this.gameArea.height();
        var goRight = gameObject.transform.left + gameObject.transform.width;
        var goBottom = gameObject.transform.top + gameObject.transform.height;
        return (gameObject.transform.left > 0 && gameObject.transform.left < gameAreaWidth &&
            gameObject.transform.top > 0 && gameObject.transform.top < gameAreaHeight &&
            goRight > 0 && goRight < gameAreaWidth &&
            goBottom > 0 && goBottom < gameAreaHeight);
    };
    GameEngine.prototype.getScore = function () {
        return this.score;
    };
    GameEngine.prototype.getLives = function () {
        return this.lives;
    };
    GameEngine.prototype.checkIfCruiserDeleted = function (removedObjects) {
        if (removedObjects.length === 0) {
            return;
        }
        var isDeleted = false;
        for (var i = 0; i < removedObjects.length; i++) {
            if (removedObjects[i] instanceof StarShip) {
                isDeleted = true;
                break;
            }
        }
        if (isDeleted === true) {
            this.lives--;
            if (this.lives > 0) {
                this.createStarShip();
            }
            else {
                this.createGameOverObject();
            }
        }
    };
    GameEngine.prototype.restoreAsteroidsAmount = function (removedObjects) {
        if (removedObjects.length === 0) {
            return;
        }
        var amountOfAsteroids = 0;
        for (var i = 0; i < removedObjects.length; i++) {
            if (removedObjects[i] instanceof Asteroid) {
                amountOfAsteroids++;
            }
        }
        this.createAsteroids(amountOfAsteroids);
    };
    return GameEngine;
}());
var GameManager = (function () {
    function GameManager() {
        this.gameMenu = null;
        this.gameEngine = null;
        this.gameController = null;
        this.isStarted = false;
    }
    GameManager.instance = function () {
        if (GameManager.gameManagerInstance == null) {
            GameManager.gameManagerInstance = new GameManager();
        }
        return GameManager.gameManagerInstance;
    };
    GameManager.prototype.start = function () {
        this.gameMenu = new GameMenu();
        this.gameEngine = new GameEngine();
        this.gameController = new GameController();
        this.gameMenu.showMenu(this.gameEngine.isGameStarted());
    };
    GameManager.prototype.startNewGame = function () {
        this.isStarted = true;
        this.gameMenu.hideMenu();
        this.gameEngine.startNewGame();
    };
    GameManager.prototype.pauseGame = function () {
        this.gameEngine.pauseGame();
        this.gameMenu.showMenu(this.gameEngine.isGameStarted());
    };
    GameManager.prototype.resumeGame = function () {
        this.gameMenu.hideMenu();
        this.gameEngine.resumeGame();
    };
    GameManager.prototype.onAction = function (action) {
        this.gameEngine.onAction(action);
    };
    GameManager.prototype.addGameObject = function (gameObject) {
        this.gameEngine.addGameObject(gameObject);
    };
    GameManager.prototype.removeGameObject = function (gameObject) {
        this.gameEngine.removeGameObject(gameObject);
    };
    GameManager.prototype.isInsideGameArea = function (gameObject) {
        return this.gameEngine.isInsideGameArea(gameObject);
    };
    GameManager.prototype.getScore = function () {
        return this.gameEngine.getScore();
    };
    GameManager.prototype.getLives = function () {
        return this.gameEngine.getLives();
    };
    return GameManager;
}());
GameManager.gameManagerInstance = null;
var GameMenu = (function () {
    function GameMenu() {
        this.startGameButton = null;
        this.resumeGameButton = null;
        this.gameMenu = null;
    }
    GameMenu.prototype.hideMenu = function () {
        this.gameMenu.hide();
    };
    GameMenu.prototype.showMenu = function (showResumeButton) {
        this.init();
        this.gameMenu.show();
        if (showResumeButton === true) {
            this.resumeGameButton.show();
        }
        else {
            this.resumeGameButton.hide();
        }
    };
    GameMenu.prototype.init = function () {
        if (this.startGameButton == null) {
            this.startGameButton = $('#startGameButton');
            this.startGameButton.on('click', function () {
                GameManager.instance().startNewGame();
            });
        }
        if (this.resumeGameButton == null) {
            this.resumeGameButton = $('#resumeGameButton');
            this.resumeGameButton.on('click', function () {
                GameManager.instance().resumeGame();
            });
        }
        if (this.gameMenu == null) {
            this.gameMenu = $('#gameMenu');
        }
    };
    return GameMenu;
}());
var GameObject = (function () {
    function GameObject() {
        this.name = null;
        this.components = [];
        this.transform = new Transform();
    }
    GameObject.prototype.getComponent = function (name) {
        for (var i = 0; i < this.components.length; i++) {
            if (this.components[i].name === name) {
                return this.components[i];
            }
        }
        return null;
    };
    GameObject.prototype.start = function () {
        if (this.components.length === 0) {
            var component = new HtmlRenderer(this);
            component.name = 'HtmlRenderer';
            this.components.push(component);
        }
        this.components.forEach(function (component) {
            component.start();
        });
    };
    ;
    GameObject.prototype.draw = function () {
        this.components.forEach(function (component) {
            component.draw();
        });
    };
    ;
    GameObject.prototype.update = function () {
        this.components.forEach(function (component) {
            component.update();
        });
    };
    GameObject.prototype.destroy = function () {
        this.components.forEach(function (component) {
            component.destroy();
        });
    };
    return GameObject;
}());
/// <reference path="GameObject.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AnimatedObject = (function (_super) {
    __extends(AnimatedObject, _super);
    function AnimatedObject(pathToTexture, slideWidth, slideHeight, slidesCount, slidesInARow, animationSpeed, repeat, animationFinished) {
        var _this = _super.call(this) || this;
        _this.pathToTexture = pathToTexture;
        _this.slideWidth = slideWidth;
        _this.slideHeight = slideHeight;
        _this.slidesCount = slidesCount;
        _this.slidesInARow = slidesInARow;
        _this.animationSpeed = animationSpeed;
        _this.repeat = repeat;
        _this.animationFinished = animationFinished;
        _this.slide = 0;
        _this.counter = 0;
        _this.xScale = 1;
        _this.yScale = 1;
        return _this;
    }
    AnimatedObject.prototype.start = function () {
        _super.prototype.start.call(this);
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        renderer.element.css({ 'background-image': 'url("' + this.pathToTexture + '")' });
        renderer.element.css({ 'position': 'absolute' });
        this.xScale = this.slideWidth / this.transform.width;
        this.yScale = this.slideHeight / this.transform.height;
        var backgroundXSize = ((this.slideWidth * this.slidesInARow) / this.xScale);
        var backgroundYSize = ((Math.ceil(this.slidesCount / this.slidesInARow) * this.slideHeight) / this.yScale);
        renderer.element.css({ 'background-size': backgroundXSize + 'px ' + backgroundYSize + 'px' });
    };
    AnimatedObject.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var y = Math.floor(this.slide / this.slidesInARow);
        var x = this.slide - (y * this.slidesInARow) - 1;
        var xShift = (x * (this.slideWidth / this.xScale));
        var yShift = (y * (this.slideHeight / this.yScale));
        var backPos = '-' + xShift + 'px -' + yShift + 'px';
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        renderer.element.css({ 'background-position': backPos });
    };
    AnimatedObject.prototype.update = function () {
        this.slide++;
        if (this.slide >= this.slidesCount) {
            if (this.animationFinished != null) {
                this.animationFinished();
            }
            this.slide = 0;
        }
        _super.prototype.update.call(this);
    };
    return AnimatedObject;
}(GameObject));
var IntersectObject = (function (_super) {
    __extends(IntersectObject, _super);
    function IntersectObject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.checkCollision = true;
        _this.drawTransparentCollision = true;
        return _this;
    }
    IntersectObject.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        if (this.checkCollision === false && this.drawTransparentCollision === true) {
            renderer.element.addClass('halfTransparent');
        }
        else {
            renderer.element.removeClass('halfTransparent');
        }
    };
    ;
    IntersectObject.prototype.intersects = function (gameObject) {
        if ((gameObject.transform.left >= this.transform.left && gameObject.transform.left <= this.transform.left + this.transform.width) &&
            (gameObject.transform.top >= this.transform.top && gameObject.transform.top <= this.transform.top + this.transform.height)) {
            return true;
        }
        if ((gameObject.transform.left >= this.transform.left && gameObject.transform.left <= this.transform.left + this.transform.width) &&
            (gameObject.transform.top + gameObject.transform.height >= this.transform.top && gameObject.transform.top + gameObject.transform.height <= this.transform.top + this.transform.height)) {
            return true;
        }
        if ((gameObject.transform.left + gameObject.transform.width >= this.transform.left && gameObject.transform.left + gameObject.transform.width <= this.transform.left + this.transform.width) &&
            (gameObject.transform.top + gameObject.transform.height >= this.transform.top && gameObject.transform.top + gameObject.transform.height <= this.transform.top + this.transform.height)) {
            return true;
        }
        if ((gameObject.transform.left + gameObject.transform.width >= this.transform.left && gameObject.transform.left + gameObject.transform.width <= this.transform.left + this.transform.width) &&
            (gameObject.transform.top >= this.transform.top && gameObject.transform.top <= this.transform.top + this.transform.height)) {
            return true;
        }
    };
    return IntersectObject;
}(GameObject));
/// <reference path="IntersectObject.ts" />
var MovingObject = (function (_super) {
    __extends(MovingObject, _super);
    function MovingObject() {
        var _this = _super.call(this) || this;
        _this.speed = 0;
        _this.direction = MovingObjectDirection.east;
        return _this;
    }
    MovingObject.prototype.update = function () {
        switch (this.direction) {
            case MovingObjectDirection.north:
                this.transform.top -= this.speed;
                break;
            case MovingObjectDirection.northeast:
                this.transform.top -= this.speed;
                this.transform.left += this.speed;
                break;
            case MovingObjectDirection.east:
                this.transform.left += this.speed;
                break;
            case MovingObjectDirection.southeast:
                this.transform.top += this.speed;
                this.transform.left += this.speed;
                break;
            case MovingObjectDirection.south:
                this.transform.top += this.speed;
                break;
            case MovingObjectDirection.southwest:
                this.transform.top += this.speed;
                this.transform.left -= this.speed;
                break;
            case MovingObjectDirection.west:
                this.transform.left -= this.speed;
                break;
            case MovingObjectDirection.northwest:
                this.transform.top -= this.speed;
                this.transform.left -= this.speed;
                break;
        }
    };
    MovingObject.prototype.updateDirection = function () {
        var deg = this.direction * 45 - 90;
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        renderer.element.css('transform', 'rotate(' + deg + 'deg)');
    };
    MovingObject.prototype.turnRight = function (steps) {
        this.direction += steps;
        if (this.direction > 7) {
            this.direction = this.direction - 8;
        }
        this.updateDirection();
    };
    ;
    MovingObject.prototype.turnLeft = function (steps) {
        this.direction -= steps;
        if (this.direction < 0) {
            this.direction = 8 + this.direction;
        }
        this.updateDirection();
    };
    ;
    return MovingObject;
}(IntersectObject));
/// <reference path="MovingObject.ts" />
var Asteroid = (function (_super) {
    __extends(Asteroid, _super);
    function Asteroid() {
        var _this = _super.call(this) || this;
        _this.transform.width = 25;
        _this.transform.height = 25;
        return _this;
    }
    Asteroid.prototype.start = function () {
        _super.prototype.start.call(this);
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        renderer.element.addClass('asteroid');
    };
    Asteroid.prototype.update = function () {
        var oldTop = this.transform.top;
        var oldLeft = this.transform.left;
        _super.prototype.update.call(this);
        if (this.checkCollision === false) {
            if (!GameManager.instance().isInsideGameArea(this)) {
                return;
            }
            this.checkCollision = true;
        }
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        var gameAreaWidth = renderer.gameArea.width();
        var gameAreaHeight = renderer.gameArea.height();
        if (this.transform.top < 0 || this.transform.left < 0 || (this.transform.left + this.transform.width) > gameAreaWidth || (this.transform.top + this.transform.height) > gameAreaHeight) {
            this.checkRicochet(gameAreaWidth, gameAreaHeight);
            this.transform.top = oldTop;
            this.transform.left = oldLeft;
        }
    };
    ;
    Asteroid.prototype.checkRicochet = function (gameAreaWidth, gameAreaHeight) {
        if ((this.transform.top + this.transform.height) > gameAreaHeight) {
            if (this.direction === MovingObjectDirection.southeast) {
                this.turnLeft(2);
            }
            else if (this.direction === MovingObjectDirection.south) {
                this.direction = MovingObjectDirection.north;
            }
            else if (this.direction === MovingObjectDirection.southwest) {
                this.turnRight(2);
            }
        }
        if ((this.transform.left + this.transform.width) > gameAreaWidth) {
            if (this.direction === MovingObjectDirection.northeast) {
                this.turnLeft(2);
            }
            else if (this.direction === MovingObjectDirection.east) {
                this.direction = MovingObjectDirection.west;
            }
            else if (this.direction === MovingObjectDirection.southeast) {
                this.turnRight(2);
            }
        }
        if (this.transform.top < 0) {
            if (this.direction === MovingObjectDirection.northeast) {
                this.turnRight(2);
            }
            else if (this.direction === MovingObjectDirection.north) {
                this.direction = MovingObjectDirection.south;
            }
            else if (this.direction === MovingObjectDirection.northwest) {
                this.turnLeft(2);
            }
        }
        if (this.transform.left < 0) {
            if (this.direction === MovingObjectDirection.northwest) {
                this.turnRight(2);
            }
            else if (this.direction === MovingObjectDirection.west) {
                this.direction = MovingObjectDirection.east;
            }
            else if (this.direction === MovingObjectDirection.southwest) {
                this.turnLeft(2);
            }
        }
        this.updateDirection();
    };
    Asteroid.prototype.draw = function () {
        _super.prototype.draw.call(this);
    };
    return Asteroid;
}(MovingObject));
/// <reference path="MovingObject.ts" />
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this = _super.call(this) || this;
        _this.transform.width = 10;
        _this.transform.height = 10;
        return _this;
    }
    Bullet.prototype.start = function () {
        _super.prototype.start.call(this);
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        renderer.element.addClass('bullet');
    };
    Bullet.prototype.update = function () {
        _super.prototype.update.call(this);
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        var gameAreaWidth = renderer.gameArea.width();
        var gameAreaHeight = renderer.gameArea.height();
        if (this.transform.top < 0 || this.transform.left < 0 || (this.transform.left + this.transform.width) > gameAreaWidth || (this.transform.top + this.transform.height) > gameAreaHeight) {
            GameManager.instance().removeGameObject(this);
        }
    };
    return Bullet;
}(MovingObject));
var GameOverObject = (function (_super) {
    __extends(GameOverObject, _super);
    function GameOverObject() {
        var _this = _super.call(this) || this;
        _this.gameOverText = 'GAME OVER';
        return _this;
    }
    GameOverObject.prototype.start = function () {
        _super.prototype.start.call(this);
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        renderer.element.addClass('gameOverText');
        renderer.element.css({
            'width': '',
            'height': ''
        });
    };
    GameOverObject.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        renderer.element.text(this.gameOverText);
    };
    GameOverObject.prototype.update = function () {
        _super.prototype.update.call(this);
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        this.transform.left = renderer.gameArea.width() / 2 - renderer.element.width() / 2;
        this.transform.top = renderer.gameArea.height() / 2 - renderer.element.height() / 2;
    };
    return GameOverObject;
}(GameObject));
var LivesObject = (function (_super) {
    __extends(LivesObject, _super);
    function LivesObject() {
        var _this = _super.call(this) || this;
        _this.lives = null;
        _this.elementWidth = 25;
        _this.drawnLives = 0;
        _this.transform.width = _this.elementWidth * _this.lives;
        return _this;
    }
    LivesObject.prototype.start = function () {
        _super.prototype.start.call(this);
    };
    LivesObject.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        if (this.drawnLives === this.lives) {
            return;
        }
        renderer.element.empty();
        for (var i = 0; i < this.lives; i++) {
            var liveElement = $('<div class="livesIndicatorElement"></div>');
            liveElement.css({
                'left': i * this.elementWidth + 'px'
            });
            renderer.element.append(liveElement);
        }
        this.drawnLives = this.lives;
    };
    LivesObject.prototype.update = function () {
        _super.prototype.update.call(this);
        this.lives = GameManager.instance().getLives();
    };
    return LivesObject;
}(GameObject));
var ScoreIndicator = (function () {
    function ScoreIndicator(gameObject) {
        this.score = null;
        this.gameObject = gameObject;
    }
    ScoreIndicator.prototype.start = function () {
    };
    ScoreIndicator.prototype.draw = function () {
        var renderer = this.gameObject.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        renderer.element.text(this.score.toString());
    };
    ScoreIndicator.prototype.update = function () {
        this.score = GameManager.instance().getScore();
    };
    ScoreIndicator.prototype.destroy = function () {
    };
    return ScoreIndicator;
}());
/// <reference path="MovingObject.ts" />
var StarShip = (function (_super) {
    __extends(StarShip, _super);
    function StarShip() {
        var _this = _super.call(this) || this;
        _this.transform.width = 50;
        _this.transform.height = 50;
        return _this;
    }
    StarShip.prototype.start = function () {
        var _this = this;
        _super.prototype.start.call(this);
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        renderer.element.addClass('starShip');
        setTimeout(function () {
            _this.checkCollision = true;
        }, 3000);
    };
    StarShip.prototype.update = function () {
        var oldTop = this.transform.top;
        var oldLeft = this.transform.left;
        _super.prototype.update.call(this);
        var renderer = this.getComponent('HtmlRenderer');
        if (renderer == null) {
            return;
        }
        var gameAreaWidth = renderer.gameArea.width();
        var gameAreaHeight = renderer.gameArea.height();
        if (this.transform.top < 0 || this.transform.left < 0 || (this.transform.left + this.transform.width) > gameAreaWidth || (this.transform.top + this.transform.height) > gameAreaHeight) {
            this.checkRicochet(gameAreaWidth, gameAreaHeight);
            this.transform.top = oldTop;
            this.transform.left = oldLeft;
        }
    };
    StarShip.prototype.checkRicochet = function (gameAreaWidth, gameAreaHeight) {
        if ((this.transform.top + this.transform.height) > gameAreaHeight) {
            if (this.direction === MovingObjectDirection.southeast) {
                this.turnLeft(1);
            }
            else if (this.direction === MovingObjectDirection.south) {
                this.direction = MovingObjectDirection.north;
            }
            else if (this.direction === MovingObjectDirection.southwest) {
                this.turnRight(1);
            }
        }
        if ((this.transform.left + this.transform.width) > gameAreaWidth) {
            if (this.direction === MovingObjectDirection.northeast) {
                this.turnLeft(1);
            }
            else if (this.direction === MovingObjectDirection.east) {
                this.direction = MovingObjectDirection.west;
            }
            else if (this.direction === MovingObjectDirection.southeast) {
                this.turnRight(1);
            }
        }
        if (this.transform.top < 0) {
            if (this.direction === MovingObjectDirection.northeast) {
                this.turnRight(1);
            }
            else if (this.direction === MovingObjectDirection.north) {
                this.direction = MovingObjectDirection.south;
            }
            else if (this.direction === MovingObjectDirection.northwest) {
                this.turnRight(1);
            }
        }
        if (this.transform.left < 0) {
            if (this.direction === MovingObjectDirection.northwest) {
                this.turnRight(1);
            }
            else if (this.direction === MovingObjectDirection.west) {
                this.direction = MovingObjectDirection.east;
            }
            else if (this.direction === MovingObjectDirection.southwest) {
                this.turnRight(1);
            }
        }
        this.updateDirection();
    };
    StarShip.prototype.onAction = function (action) {
        if (action === Action.left) {
            this.turnLeft(1);
        }
        if (action === Action.right) {
            this.turnRight(1);
        }
        if (action === Action.forward) {
            this.speed++;
        }
        if (action === Action.backward) {
            this.speed--;
        }
        if (action === Action.fire) {
            var bullet = new Bullet();
            bullet.speed = this.speed + 1;
            bullet.direction = this.direction;
            if (this.direction === MovingObjectDirection.north) {
                bullet.transform.left = this.transform.left + (this.transform.width / 2 - bullet.transform.width / 2);
                bullet.transform.top = this.transform.top - bullet.transform.height;
            }
            if (this.direction === MovingObjectDirection.northeast) {
                bullet.transform.left = this.transform.left + this.transform.width; // - bullet.width;
                bullet.transform.top = this.transform.top - bullet.transform.height; // + bullet.height / 2;
            }
            if (this.direction === MovingObjectDirection.east) {
                bullet.transform.left = this.transform.left + this.transform.width;
                bullet.transform.top = (this.transform.top + this.transform.height / 2) - bullet.transform.height / 2;
            }
            if (this.direction === MovingObjectDirection.southeast) {
                bullet.transform.left = this.transform.left + this.transform.width;
                bullet.transform.top = this.transform.top + this.transform.height;
            }
            if (this.direction === MovingObjectDirection.south) {
                bullet.transform.left = this.transform.left + (this.transform.width / 2 - bullet.transform.width / 2);
                bullet.transform.top = this.transform.top + this.transform.height;
            }
            if (this.direction === MovingObjectDirection.southwest) {
                bullet.transform.left = this.transform.left - bullet.transform.width;
                bullet.transform.top = this.transform.top + this.transform.height;
            }
            if (this.direction === MovingObjectDirection.west) {
                bullet.transform.left = this.transform.left - bullet.transform.width;
                bullet.transform.top = this.transform.top + (this.transform.height / 2 - bullet.transform.height / 2);
            }
            if (this.direction === MovingObjectDirection.northwest) {
                bullet.transform.left = this.transform.left - bullet.transform.width;
                bullet.transform.top = this.transform.top - bullet.transform.height;
            }
            GameManager.instance().addGameObject(bullet);
        }
        if (this.speed < 0) {
            this.speed = 0;
        }
    };
    return StarShip;
}(MovingObject));
var HtmlRenderer = (function () {
    function HtmlRenderer(gameObject) {
        this.element = null;
        this.gameArea = $('#gameArea');
        this.gameObject = gameObject;
    }
    HtmlRenderer.prototype.start = function () {
        this.element = $('<div></div>');
        this.element.addClass('gameObject');
        if (this.className != null) {
            this.element.addClass(this.className);
        }
        this.element.css({
            'width': this.gameObject.transform.width + 'px',
            'height': this.gameObject.transform.height + 'px'
        });
        this.gameArea.append(this.element);
    };
    HtmlRenderer.prototype.draw = function () {
        this.element.css({
            'left': this.gameObject.transform.left + 'px',
            'top': this.gameObject.transform.top + 'px'
        });
    };
    HtmlRenderer.prototype.update = function () {
    };
    HtmlRenderer.prototype.destroy = function () {
        this.element.remove();
    };
    return HtmlRenderer;
}());
var GameLoader = (function () {
    function GameLoader() {
    }
    GameLoader.load = function (data) {
        var gameObjects = [];
        data.scenes[0].gameObjects.forEach(function (gameObjectData) {
            var gameObject = GameObjectBuilder.build(gameObjectData);
            gameObjectData.components.forEach(function (componentData) {
                var component = ComponentBuilder.build(gameObject, componentData);
                gameObject.components.push(component);
            });
            gameObjects.push(gameObject);
        });
        return gameObjects;
    };
    return GameLoader;
}());
var NameValuePair = (function () {
    function NameValuePair() {
        this.name = null;
        this.value = null;
    }
    return NameValuePair;
}());
var ComponentBuilder = (function () {
    function ComponentBuilder() {
    }
    ComponentBuilder.build = function (gameObject, componentData) {
        var component;
        switch (componentData.name) {
            case 'HtmlRenderer':
                component = new HtmlRenderer(gameObject);
                component.name = componentData.name;
                break;
            case 'ScoreIndicator':
                component = new ScoreIndicator(gameObject);
                component.name = componentData.name;
                break;
            default:
                throw new Error('Component is not implemented');
        }
        componentData.data.forEach(function (dataItem) {
            component[dataItem.name] = dataItem.value;
        });
        return component;
    };
    return ComponentBuilder;
}());
var Transform = (function () {
    function Transform() {
        this.left = 0;
        this.top = 0;
        this.width = 100;
        this.height = 100;
    }
    return Transform;
}());
var GameObjectBuilder = (function () {
    function GameObjectBuilder() {
    }
    GameObjectBuilder.build = function (gameObjectData) {
        var gameObject = new GameObject();
        gameObject.name = gameObjectData.name;
        gameObject.transform.width = gameObjectData.transform.width;
        gameObject.transform.height = gameObjectData.transform.height;
        gameObject.transform.left = gameObjectData.transform.left;
        gameObject.transform.top = gameObjectData.transform.top;
        return gameObject;
    };
    return GameObjectBuilder;
}());
//# sourceMappingURL=starship.js.map
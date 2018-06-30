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
        var self = this;
        $(window).resize(function () {
            self.onWindowResize();
        });
        this.onWindowResize();
    }
    GameEngine.prototype.startNewGame = function () {
        this.gameArea.empty();
        this.isStarted = true;
        this.gameObjects = [];
        var s = new StarShip();
        s.left = 100;
        s.top = 100;
        // s.checkCollision = false;
        this.addGameObject(s);
        this.createAsteroids(5);
        this.startTimer();
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
            this.gameObjects[0].onAction(action);
        }
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
    GameEngine.prototype.calcAsteroidPos = function (asteroid) {
        var gameAreaWidth = this.gameArea.width();
        var gameAreaHeight = this.gameArea.height();
        var side = this.getRandom(0, 3);
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
                if (asteroid.left < gameAreaWidth / 2) {
                    asteroid.direction = MovingObjectDirection.southeast;
                }
                else {
                    asteroid.direction = MovingObjectDirection.southwest;
                }
                break;
            case 1:
                if (asteroid.top < gameAreaHeight / 2) {
                    asteroid.direction = MovingObjectDirection.southwest;
                }
                else {
                    asteroid.direction = MovingObjectDirection.northwest;
                }
                break;
            case 2:
                if (asteroid.left < gameAreaWidth / 2) {
                    asteroid.direction = MovingObjectDirection.northeast;
                }
                else {
                    asteroid.direction = MovingObjectDirection.northwest;
                }
                break;
            case 3:
                if (asteroid.top < gameAreaHeight / 2) {
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
        var result = [];
        for (var i = 0; i < this.gameObjects.length; i++) {
            var gObj = this.gameObjects[i];
            for (var t = i + 1; t < this.gameObjects.length; t++) {
                var gObj1 = this.gameObjects[t];
                if (gObj.checkCollision === false || gObj1.checkCollision === false) {
                    continue;
                }
                if (gObj.intersects(gObj1) || gObj1.intersects(gObj)) {
                    result.push(gObj1);
                    result.push(gObj);
                }
            }
        }
        var _loop_1 = function (i) {
            GameManager.instance().removeGameObject(result[i]);
            var aObj = new AnimatedObject('./img/explosion-sprite.png', 100, 100, 74, 9, 1000, true, function () {
                _this.removeGameObject(aObj);
            });
            aObj.left = result[i].left;
            aObj.top = result[i].top;
            aObj.checkCollision = false;
            this_1.addGameObject(aObj);
        };
        var this_1 = this;
        for (var i = 0; i < result.length; i++) {
            _loop_1(i);
        }
        if (result.length > 0) {
            this.createAsteroids(2);
        }
    };
    GameEngine.prototype.isInsideGameArea = function (gameObject) {
        var gameAreaWidth = this.gameArea.width();
        var gameAreaHeight = this.gameArea.height();
        var goRight = gameObject.left + gameObject.width;
        var goBottom = gameObject.top + gameObject.height;
        return (gameObject.left > 0 && gameObject.left < gameAreaWidth &&
            gameObject.top > 0 && gameObject.top < gameAreaHeight &&
            goRight > 0 && goRight < gameAreaWidth &&
            goBottom > 0 && goBottom < gameAreaHeight);
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
        this.left = 0;
        this.top = 0;
        this.width = 100;
        this.height = 100;
        this.checkCollision = true;
        this.gameArea = $('#gameArea');
        this.element = null;
    }
    GameObject.prototype.start = function () {
        this.element = $('<div></div>');
        this.gameArea.append(this.element);
    };
    ;
    GameObject.prototype.draw = function () {
        this.element.css({ 'left': this.left + 'px', 'top': this.top + 'px' });
    };
    ;
    GameObject.prototype.update = function () {
    };
    GameObject.prototype.destroy = function () {
        this.element.remove();
    };
    ;
    GameObject.prototype.intersects = function (gameObject) {
        if ((gameObject.left >= this.left && gameObject.left <= this.left + this.width) &&
            (gameObject.top >= this.top && gameObject.top <= this.top + this.height)) {
            return true;
        }
        if ((gameObject.left >= this.left && gameObject.left <= this.left + this.width) &&
            (gameObject.top + gameObject.height >= this.top && gameObject.top + gameObject.height <= this.top + this.height)) {
            return true;
        }
        if ((gameObject.left + gameObject.width >= this.left && gameObject.left + gameObject.width <= this.left + this.width) &&
            (gameObject.top + gameObject.height >= this.top && gameObject.top + gameObject.height <= this.top + this.height)) {
            return true;
        }
        if ((gameObject.left + gameObject.width >= this.left && gameObject.left + gameObject.width <= this.left + this.width) &&
            (gameObject.top >= this.top && gameObject.top <= this.top + this.height)) {
            return true;
        }
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
        return _this;
    }
    AnimatedObject.prototype.start = function () {
        _super.prototype.start.call(this);
        this.element.css({ 'background-image': 'url("' + this.pathToTexture + '")' });
        this.element.css({ 'position': 'absolute' });
        // this.element.css({'background-repeat': 'no-repeat'});
        // this.element.css({'background-attachment': 'fixed'});
    };
    AnimatedObject.prototype.draw = function () {
        _super.prototype.draw.call(this);
        this.element.css({ 'width': this.slideWidth + 'px', 'height': this.slideHeight + 'px' });
        var y = Math.floor(this.slide / this.slidesInARow); // (this.slide * this.slideWidth)
        var x = this.slide - (y * this.slidesInARow) - 1;
        var backPos = '-' + (x * this.slideWidth) + 'px -' + (y * this.slideHeight) + 'px';
        this.element.css({ 'background-position': backPos });
    };
    AnimatedObject.prototype.update = function () {
        /*      this.counter++;
              if(this.counter > 2) {
                  this.counter = 0;
      */
        this.slide++;
        if (this.slide >= this.slidesCount) {
            if (this.animationFinished != null) {
                this.animationFinished();
            }
            this.slide = 0;
        }
        /*
                }*/
        _super.prototype.update.call(this);
    };
    return AnimatedObject;
}(GameObject));
/// <reference path="GameObject.ts" />
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
                this.top -= this.speed;
                break;
            case MovingObjectDirection.northeast:
                this.top -= this.speed;
                this.left += this.speed;
                break;
            case MovingObjectDirection.east:
                this.left += this.speed;
                break;
            case MovingObjectDirection.southeast:
                this.top += this.speed;
                this.left += this.speed;
                break;
            case MovingObjectDirection.south:
                this.top += this.speed;
                break;
            case MovingObjectDirection.southwest:
                this.top += this.speed;
                this.left -= this.speed;
                break;
            case MovingObjectDirection.west:
                this.left -= this.speed;
                break;
            case MovingObjectDirection.northwest:
                this.top -= this.speed;
                this.left -= this.speed;
                break;
        }
    };
    MovingObject.prototype.updateDirection = function () {
        var deg = this.direction * 45 - 90;
        this.element.css('transform', 'rotate(' + deg + 'deg)');
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
}(GameObject));
/// <reference path="MovingObject.ts" />
var Asteroid = (function (_super) {
    __extends(Asteroid, _super);
    function Asteroid() {
        var _this = _super.call(this) || this;
        _this.width = 100;
        _this.height = 100;
        return _this;
    }
    Asteroid.prototype.start = function () {
        _super.prototype.start.call(this);
        this.element.addClass('asteroid');
    };
    Asteroid.prototype.update = function () {
        var oldTop = this.top;
        var oldLeft = this.left;
        _super.prototype.update.call(this);
        if (this.checkCollision === false) {
            if (!GameManager.instance().isInsideGameArea(this)) {
                return;
            }
            this.checkCollision = true;
        }
        var gameAreaWidth = this.gameArea.width();
        var gameAreaHeight = this.gameArea.height();
        if (this.top < 0 || this.left < 0 || (this.left + this.width) > gameAreaWidth || (this.top + this.height) > gameAreaHeight) {
            this.checkRicochet(gameAreaWidth, gameAreaHeight);
            this.top = oldTop;
            this.left = oldLeft;
        }
    };
    ;
    Asteroid.prototype.checkRicochet = function (gameAreaWidth, gameAreaHeight) {
        if ((this.top + this.height) > gameAreaHeight) {
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
        if ((this.left + this.width) > gameAreaWidth) {
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
        if (this.top < 0) {
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
        if (this.left < 0) {
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
        if (this.checkCollision === true) {
            this.element.removeClass('halfTransparent');
        }
        else {
            this.element.addClass('halfTransparent');
        }
    };
    return Asteroid;
}(MovingObject));
/// <reference path="MovingObject.ts" />
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this = _super.call(this) || this;
        _this.width = 10;
        _this.height = 10;
        return _this;
    }
    Bullet.prototype.start = function () {
        _super.prototype.start.call(this);
        this.element.addClass('bullet');
    };
    Bullet.prototype.update = function () {
        _super.prototype.update.call(this);
        var gameAreaWidth = this.gameArea.width();
        var gameAreaHeight = this.gameArea.height();
        if (this.top < 0 || this.left < 0 || (this.left + this.width) > gameAreaWidth || (this.top + this.height) > gameAreaHeight) {
            GameManager.instance().removeGameObject(this);
        }
    };
    return Bullet;
}(MovingObject));
/// <reference path="MovingObject.ts" />
var StarShip = (function (_super) {
    __extends(StarShip, _super);
    function StarShip() {
        return _super.call(this) || this;
    }
    StarShip.prototype.start = function () {
        _super.prototype.start.call(this);
        this.element.addClass('starShip');
    };
    StarShip.prototype.update = function () {
        var oldTop = this.top;
        var oldLeft = this.left;
        _super.prototype.update.call(this);
        var gameAreaWidth = this.gameArea.width();
        var gameAreaHeight = this.gameArea.height();
        if (this.top < 0 || this.left < 0 || (this.left + this.width) > gameAreaWidth || (this.top + this.height) > gameAreaHeight) {
            this.checkRicochet(gameAreaWidth, gameAreaHeight);
            this.top = oldTop;
            this.left = oldLeft;
        }
    };
    StarShip.prototype.checkRicochet = function (gameAreaWidth, gameAreaHeight) {
        if ((this.top + this.height) > gameAreaHeight) {
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
        if ((this.left + this.width) > gameAreaWidth) {
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
        if (this.top < 0) {
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
        if (this.left < 0) {
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
                bullet.left = this.left + (this.width / 2 - bullet.width / 2);
                bullet.top = this.top - bullet.height;
            }
            if (this.direction === MovingObjectDirection.northeast) {
                bullet.left = this.left + this.width; // - bullet.width;
                bullet.top = this.top - bullet.height; // + bullet.height / 2;
            }
            if (this.direction === MovingObjectDirection.east) {
                bullet.left = this.left + this.width;
                bullet.top = (this.top + this.height / 2) - bullet.height / 2;
            }
            if (this.direction === MovingObjectDirection.southeast) {
                bullet.left = this.left + this.width;
                bullet.top = this.top + this.height;
            }
            if (this.direction === MovingObjectDirection.south) {
                bullet.left = this.left + (this.width / 2 - bullet.width / 2);
                bullet.top = this.top + this.height;
            }
            if (this.direction === MovingObjectDirection.southwest) {
                bullet.left = this.left - bullet.width;
                bullet.top = this.top + this.height;
            }
            if (this.direction === MovingObjectDirection.west) {
                bullet.left = this.left - bullet.width;
                bullet.top = this.top + (this.height / 2 - bullet.height / 2);
            }
            if (this.direction === MovingObjectDirection.northwest) {
                bullet.left = this.left - bullet.width;
                bullet.top = this.top - bullet.height;
            }
            GameManager.instance().addGameObject(bullet);
        }
        if (this.speed < 0) {
            this.speed = 0;
        }
    };
    return StarShip;
}(MovingObject));
//# sourceMappingURL=starship.js.map
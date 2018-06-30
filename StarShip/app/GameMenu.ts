class GameMenu {

    startGameButton: JQuery = null;
    resumeGameButton: JQuery= null;
    gameMenu: JQuery = null;

    hideMenu() {
        this.gameMenu.hide();
    }

    showMenu(showResumeButton: any) {

        this.init();
        this.gameMenu.show();

        if(showResumeButton === true) {
            this.resumeGameButton.show();
        } else {
            this.resumeGameButton.hide();
        }
    }

    init() {

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
}
}

export default class Controller {

    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalID = null;
        this.isPlaying = false;

        document.addEventListener('keydown', this.keyDownHandler.bind(this));
        document.addEventListener('keyup', this.keyUpHandler.bind(this));

        this.view.renderStartScreen();
    }

    /**
     * Method updates view and moves figure down
     */
    update() {
        this.game.moveFigureDown();
        this.updateView();
    }

    /**
     * Method starts play action
     */
    play() {
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
    }

    /**
     * Method starts pause action
     */
    pause() {
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
    }

    /**
     * Method resets game
     */
    reset() {
        this.game.reset();
        this.play();
    }

    /**
     * Method updates view
     */
    updateView() {
        const state = this.game.getState();

        if (state.isGameOver)
            this.view.renderEndScreen(state);
        else if (!this.isPlaying)
            this.view.renderPauseScreen();
        else
            this.view.renderMainScreen(state);
    }

    /**
     * Method starts timer and moves figure down by 1 level,
     * and when level is higher than timer will clock faster
     */
    startTimer() {
        const speed = 1000 - this.game.getState().level * 100;  

        if (!this.intervalID) {
            this.intervalID = setInterval(() => {
                this.update();
            }, speed > 0 ? speed : 100);
        }
    }

    /**
     * Method stops timer
     */
    stopTimer() {
        if (this.intervalID) {
            clearInterval(this.intervalID);
            this.intervalID = null;
        }
    }

    /**
     * Method triggers the keydown event and call functions when a keydown event occurs
     * @param {Key down event} event 
     */
    keyDownHandler(event) {
        const state = this.game.getState();

        switch (event.keyCode) {
            case 13: // ENTER
                if (state.isGameOver)
                    this.reset();
                else if (this.isPlaying)
                    this.pause();
                else 
                    this.play();
                break;
            case 37: // LEFT ARROW
                if (this.isPlaying) {
                    this.game.moveFigureLeft();
                    this.updateView();
                } else {
                    this.stopTimer();
                }
                break;
            case 38: // UP ARROW
                if (this.isPlaying) {
                    this.game.rotateFigure();
                    this.updateView();
                } else {
                    this.stopTimer();
                }
                break;
            case 39: // RIGHT ARROW
                if (this.isPlaying) {
                    this.game.moveFigureRight();
                    this.updateView();
                } else {
                    this.stopTimer();
                }
                break;
            case 40: // DOWN ARROW
                if (this.isPlaying) {
                    this.stopTimer();
                    this.game.moveFigureDown();
                    this.updateView();
                }
                break;
        }
    }

    /**
     * Method triggers the keyup event and call functions when a keydown event occurs
     * @param {Key up event} event 
     */
    keyUpHandler(event) {
        switch (event.keyCode) {
            case 40: // DOWN ARROW
                this.startTimer();
                break;
        }
    }
}
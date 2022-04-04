export default class Game {
    
    counter = 0;
    static points = {
        '1': 40, 
        '2': 100,
        '3': 300,
        '4': 1200
    };

    constructor() {
        this.reset();
    }

    /**
     * Get level
     * @returns Current progress level
     */
    get level() {
        return Math.floor(this.lines * 0.1);
    }

    /**
     * Get state of the entire game
     * @returns Current values of state
     */
    getState() {
        const tetrisField = this.createTetrisField();
        const {y: figureY, x: figureX, blocks} = this.activeFigure;

        for (let y = 0; y < this.tetrisField.length; y++) {
            tetrisField[y] = [];
        
            for (let x = 0; x < this.tetrisField[y].length; x++)
                tetrisField[y][x] = this.tetrisField[y][x];
        }

        for (let y = 0; y < blocks.length; y++)
            for (let x = 0; x < blocks[y].length; x++)
                if (blocks[y][x])
                    tetrisField[figureY + y][figureX + x] = this.activeFigure.blocks[y][x];

        return {
            highestScore: (this.score < this.highestScore) ? this.highestScore : this.score,
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextFigure: this.nextFigure,
            tetrisField,
            isGameOver: this.topOut
        };
    }

    /**
     * Method resets the game progress including values, except for the high score which is saved
     */
    reset() {
        this.highestScore = (this.score < this.highestScore) ? this.highestScore : this.score;
        this.score = 0;
        this.lines = 0;
        this.topOut = false;
        this.tetrisField = this.createTetrisField();
        this.activeFigure = this.createFigure();
        this.nextFigure = this.createFigure();
    }

    /**
     * Method creates tetris field
     * @returns Filled tetris field array 10x20
     */
    createTetrisField() {
        const tetrisField = [];

        for (let y = 0; y < 20; y++) {
            tetrisField[y] = [];
            
            for (let x = 0; x < 10; x++)
                tetrisField[y][x] = 0;
        }
        return tetrisField;
    }

    /**
     * Method creates specific tetris figure depending on random index choice
     * @returns Figure containing the x, y position and one of the IJLOSTZ types
     */
    createFigure() {
        const index = Math.floor(Math.random() * 7);
        const type = 'IJLOSTZ'[index];
        const figure = {};
        
        switch (type) {
            case 'I':
                figure.blocks = [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ];
                break;
            case 'J':
                figure.blocks = [
                    [0,0,0],
                    [2,2,2],
                    [0,0,0]
                ];
                break;
            case 'L':
                figure.blocks = [
                    [0,0,0],
                    [3,3,3],
                    [3,0,0]
                ];
                break;
            case 'O':
                figure.blocks = [
                    [0,0,0,0],
                    [0,4,4,0],
                    [0,4,4,0],
                    [0,0,0,0]
                ];
                break;
            case 'S':
                figure.blocks = [
                    [0,0,0],
                    [0,5,5],
                    [5,5,0]
                ];
                break;
            case 'T':
                figure.blocks = [
                    [0,0,0],
                    [6,6,6],
                    [0,6,0]
                ];
                break;
            case 'Z':
                figure.blocks = [
                    [0,0,0],
                    [7,7,7],
                    [0,7,7]
                ];
                break;
            default: 
                throw new Error("Unknown figure type");
        }

        // locate figure on center when it appears on the screen
        figure.x = Math.floor((10 - figure.blocks[0].length) / 2);
        figure.y = -1;

        return figure;
    }

    /**
     * Method moves figure left
     */
    moveFigureLeft() {
        this.activeFigure.x -= 1;

        if (this.hasCollision())
            this.activeFigure.x += 1;
    }

    /**
     * Method moves figure right
     */
    moveFigureRight() {
        this.activeFigure.x += 1;

        if (this.hasCollision())
            this.activeFigure.x -= 1;
    }

    /**
     * Method moves figure down and check for collisions
     */
    moveFigureDown() {
        if (this.topOut) {
            if (this.counter === 0) {
                this.playGameOverSound();
                this.counter++;
            }
            return;
        }

        this.activeFigure.y += 1;

        if (this.hasCollision()) {
            // decrease y and draw figure when collision happened
            this.activeFigure.y -= 1; // return figure to the previous position
            this.drawFigure();
            const clearedLines = this.clearLines();
            this.updateScore(clearedLines);
            this.updateFigures();
        }

        if (this.hasCollision())
            this.topOut = true;
    }

    /**
     * Method rotates figure and check for collisions
     */
    rotateFigure() {
        this.rotateBlocks();
        
        if (this.hasCollision())
            rotateBlocks(false);
    }

    /**
     * Method rotates figure blocks
     * @param {Rotate figure clockwise by default} clockwise 
     */
    rotateBlocks(clockwise = true) {
        const blocks = this.activeFigure.blocks;
        const length = blocks.length;
        const x = Math.floor(length / 2); // find the length of half an array
        const y = length - 1;

        for (let i = 0; i < x; i++) {
            for (let j = i; j < y - i; j++) {
                const temp = blocks[i][j];

                if (clockwise) {
                    blocks[i][j] = blocks[y - j][i];
                    blocks[y - j][i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[j][y - i];
                    blocks[j][y - i] = temp;
                } else {
                    blocks[i][j] = blocks[j][y - i];
                    blocks[j][y - i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[y - j][i];
                    blocks[y - j][i] = temp;
                }
            }
        }
    }

    /**
     * Method checks if figure collided with other object
     * @returns If collision happens return true, otherwise false
     */
    hasCollision() {
        const {y: figureY, x: figureX, blocks} = this.activeFigure;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                // проверяем наличие блока в фигуре blocks[y][x],
                // на столкновение с вне поля (undefined) и
                // если поля были уже заполнены другим блоком, то
                // значит новый не сможет на него наложиться
                if (blocks[y][x]
                    && ((this.tetrisField[figureY + y] === undefined
                    || this.tetrisField[figureY + y][figureX + x] === undefined)
                    || this.tetrisField[figureY + y][figureX + x])) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Method draws figure on a tetris field
     */
    drawFigure() {
        const {y: figureY, x: figureX, blocks} = this.activeFigure;

        for (let y = 0; y < blocks.length; y++)
            for (let x = 0; x < blocks[y].length; x++)
                if (blocks[y][x])
                    this.tetrisField[figureY + y][figureX + x] = blocks[y][x]; 
    }

    /**
     * Method inserts 0s instead of figure numbers [1-7] to clear line
     * @returns Number of lines that were cleared
     */
    clearLines() {
        const rows = 20;
        const columns = 10;
        let lines = [];

        // start from the bottom
        for (let y = rows - 1; y >= 0; y--) {
            let numberOfBlocks = 0;
            
            for (let x = 0; x < columns; x++)
                if (this.tetrisField[y][x])
                    numberOfBlocks += 1;

            if (numberOfBlocks === 0)
                break;
            else if (numberOfBlocks < columns) 
                continue;
            else if (numberOfBlocks === columns)
                lines.unshift(y);
        }

        for (let index of lines) {
            /* Delete specific 1 line, so if it deletes the entire line on center, 
            then it just deletes it and does not touch others below.
            If we would use splice(index), then it would delete all rows below one
            where figures constructed a full line of blocks, and left empty space */
            this.tetrisField.splice(index, 1);
            this.tetrisField.unshift(new Array(columns).fill(0)); // fill these completed lines with 0s
            this.playLineCompletedSound();
        }

        return lines.length;
    }

    /**
     * Play sound when a line is completed
     */
    playLineCompletedSound() {
        var audio = document.getElementById('lineCompleted');
        audio.play();
    }

    /**
     * Play sound when game over
     */
    playGameOverSound() {
        var audio = document.getElementById('gameOver');
        audio.play();
    }

    /**
     * Method updates score. The more cleared lines, the higher the score
     * @param {number of cleared lines} clearedLines 
     */
    updateScore(clearedLines) {
        if (clearedLines > 0) {
            this.score += Game.points[clearedLines] * (this.level + 1);
            this.lines += clearedLines;
        }
    }

    /**
     * Update the next figure and create a new figure to display it
     * in the right panel for the user, so the user knows what to expect
     */
    updateFigures() {
        this.activeFigure = this.nextFigure;
        this.nextFigure = this.createFigure();
    }
}
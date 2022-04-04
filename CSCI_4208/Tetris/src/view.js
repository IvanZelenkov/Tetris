export default class View {

    static colors = {
        '1': 'cyan',
        '2': 'orange',
        '3': 'blue',
        '4': 'yellow',
        '5': 'green',
        '6': 'pink',
        '7': 'red'
    };

    constructor(element, width, height, rows, columns) {
        this.element = element;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this.tetrisFieldBorderWidth = 4;
        this.tetrisFieldX = this.tetrisFieldBorderWidth;
        this.tetrisFieldY =this.tetrisFieldBorderWidth;
        this.tetrisFieldWidth = this.width * 2 / 3;
        this.tetrisFieldHeight = this.height;
        this.tetrisFieldInnerWidth = this.tetrisFieldWidth - this.tetrisFieldBorderWidth * 2;
        this.tetrisFieldInnerHeight = this.tetrisFieldHeight - this.tetrisFieldBorderWidth * 2;
 
        this.blockWidth = this.tetrisFieldInnerWidth / columns;
        this.blockHeight = this.tetrisFieldInnerHeight / rows;

        this.radius = 20;

        this.panelX = this.tetrisFieldWidth + 10;
        this.panelY = 0;
        this.panelWidth = this.widt / 3;
        this.panelHeight = this.height;

        this.element.appendChild(this.canvas);
    }

    /**
     * Render main screen
     * @param {Game state} state 
     */
    renderMainScreen(state) {
        this.clearScreen();
        this.renderTetrisField(state);
        this.renderPanel(state);
    }

    /**
     * Render start screen
     */
    renderStartScreen() {
        this.context.fillStyle = 'white';
        this.context.font = '40px "TetrisFont"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
    }

    /**
     * Render pause screen
     */
    renderPauseScreen() {
        this.context.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.fillStyle = 'white';
        this.context.font = '40px "TetrisFont"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
    }

    /**
     * Render end screen
     * @param {Destructure from state object: highest score and current score} param0 
     */
    renderEndScreen({ highestScore, score }) {
        this.clearScreen();
        this.context.fillStyle = 'white';
        this.context.font = '60px "TetrisFont"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillStyle = 'red';
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 80);
        this.context.font = '40px "TetrisFont"';
        this.context.fillStyle = 'white';
        this.context.fillText('Highest Score:', this.width / 2 - 45, this.height / 2);
        this.context.fillStyle = 'gold';
        this.context.fillText(`${highestScore}`, this.width / 2 + 160, this.height / 2);
        this.context.fillStyle = 'white';
        this.context.fillText(`Score:  ${score}`, this.width / 2, this.height / 2 + 80);
        this.context.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 300);
    }

    /**
     * Method clears screen
     */
    clearScreen() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Method renders tetris field
     * @param {Destructure from state object tetris field} param0 
     */
    renderTetrisField({ tetrisField }) {
        for (let y = 0; y < tetrisField.length; y++) {
            const line = tetrisField[y];

            for (let x = 0; x < line.length; x++) {
                const block = line[x];

                // if cell is not empty
                if (block) {
                    this.renderBlock(
                        this.tetrisFieldX + (x * this.blockWidth),
                        this.tetrisFieldX + (y * this.blockHeight),
                        this.blockWidth,
                        this.blockHeight,
                        this.radius,
                        View.colors[block]
                    );
                }
            }
        }

        this.context.strokeStyle = 'white';
        this.context.lineWidth = this.tetrisFieldBorderWidth;
        this.context.strokeRect(0, 0, this.tetrisFieldWidth, this.tetrisFieldHeight);
    }

    /**
     * Method renders panel which shows user statistics and game data
     * @param {Destructure from state object: level, highest score, current score, lines and next figure} param0 
     */
    renderPanel({ level, highestScore, score, lines, nextFigure }) {
        this.context.textAlign = 'start';
        this.context.textBaseline = 'top';
        this.context.fillStyle = 'white';
        this.context.font = '30px "TetrisFont"';

        this.context.fillText('Highest', this.panelX + 20, this.panelY + 40);
        this.context.fillText('Score:', this.panelX + 20, this.panelY + 70);
        this.context.fillStyle = 'gold';
        this.context.fillText(`${highestScore}`, this.panelX + 135, this.panelY + 70);
        this.context.fillStyle = 'white';
        this.context.fillText('Current', this.panelX + 20, this.panelY + 160);
        this.context.fillText(`Score:  ${score}`, this.panelX + 20, this.panelY + 190);
        this.context.fillText(`Lines:  ${lines}`, this.panelX + 20, this.panelY + 280);
        this.context.fillText(`Level:  ${level}`, this.panelX + 20, this.panelY + 370);
        this.context.fillText('Next:', this.panelX + 20, this.panelY + 460);

        for (let y = 0; y < nextFigure.blocks.length; y++) {
            for (let x = 0; x < nextFigure.blocks.length; x++) {
                const block = nextFigure.blocks[y][x];

                if (block) {
                    this.renderBlock(
                        this.panelX + 120 + (x * this.blockWidth * 0.5),
                        this.panelY + 440 + (y * this.blockHeight * 0.5),
                        this.blockWidth * 0.5,
                        this.blockHeight * 0.5,
                        this.radius,
                        View.colors[block]
                    );
                }
                
            }
        }
    }

    /**
     * Method renders block
     * @param {block x-coordinate} x 
     * @param {block y-coordinate} y 
     * @param {block width} width 
     * @param {block height} height 
     * @param {block radius} radius 
     * @param {block color} color 
     */
    renderBlock(x, y, width, height, radius, color) {
        this.context.fillStyle = 'black';
        this.context.strokeStyle = color;
        this.context.lineWidth = 2;

        this.context.fillRect(x, y, width, height);
        this.context.strokeRect(x, y, width, height);

        this.context.lineJoin = "round";
        this.context.lineWidth = 5;

        this.context.strokeRect(x + (radius / 2), y + (radius / 2), width - 20, height - 20)
        this.context.fillRect(x + (radius / 2), y + (radius / 2), width - 20, height - 20);
    }
}
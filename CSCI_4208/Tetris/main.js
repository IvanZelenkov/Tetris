import Game from './src/game.js';
import View from './src/view.js';
import Controller from './src/controller.js';

const game = new Game();
const view = new View(root, 780, 940, 20, 10);
const controller = new Controller(game, view);

// add objects to a global object window
window.game = game;
window.view = view;
window.controller = controller;

// play background sound
var audio = new Audio('./sounds/main.mp3');
audio.play();
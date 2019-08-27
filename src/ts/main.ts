import { Game } from './Game';

import { PlayerControllerElement } from './PlayerControllerElement';
import { PlayerHistoryElement } from './PlayerHistoryElement';

import { GameController } from './GameController';

window.customElements.define('player-controller', PlayerControllerElement);
window.customElements.define('player-history', PlayerHistoryElement);

window.addEventListener('load', () => {
  const START_PAGE: HTMLElement = document.getElementById('page__start');
  const GAME_PAGE: HTMLElement = document.getElementById('page__game');

  let game: Game = null;
  let controller: GameController = null;

  document.getElementById('start-form__new-game').addEventListener('click', event => {
    const newGameForm = <HTMLFormElement> document.getElementById('start-form');
    const players = parseInt(newGameForm.elements["players"].value);
    const authority = parseInt(newGameForm.elements["authority"].value);
    
    game = new Game(players, authority);

    controller = new GameController(game);

    controller.start();

    START_PAGE.hidden = true;
    GAME_PAGE.hidden = false;

    event.preventDefault();
  });

  document.getElementById('in-game-menu__new-game').addEventListener('click', event => {
    controller.cleanup();
    game = null;
    controller = null;

    START_PAGE.hidden = false;
    GAME_PAGE.hidden = true;
  })


});


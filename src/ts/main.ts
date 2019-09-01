import { Game } from './Game';
import { ViewState } from './ViewState';

import { PlayerControllerElement } from './PlayerControllerElement';
import { PlayerHistoryElement } from './PlayerHistoryElement';

import { GameController } from './GameController';
import { GameStateRepo } from './GameStateRepo';
import { ViewStateRepo } from './ViewStateRepo';

window.customElements.define('player-controller', PlayerControllerElement);
window.customElements.define('player-history', PlayerHistoryElement);

window.addEventListener('load', async () => {
  const START_PAGE: HTMLElement = document.getElementById('page__start');
  const GAME_PAGE: HTMLElement = document.getElementById('page__game');

  const IN_GAME_MENU: HTMLElement = document.getElementById('in-game-menu');

  const IN_GAME_MENU_TOGGLE_BUTTON: HTMLElement
      = document.getElementById('menu-toggle--in-game-menu');

  const FULL_SCREEN_ACTIVATION_BUTTON: HTMLElement
      = document.getElementById('full-screen--activate');

  const SEARCH_PARAMS = new URLSearchParams(location.search);

  let game: Game = null;
  let controller: GameController = null;
  let viewState: ViewState = null;

  START_PAGE.hidden = false;

  const gameStateRepo = new GameStateRepo('game');
  const viewStateRepo = new ViewStateRepo('view-state');

  function initGame() {
    controller = new GameController(game, viewState, gameStateRepo, viewStateRepo);

    controller.start();

    START_PAGE.hidden = true;
    GAME_PAGE.hidden = false;
  }

  if (viewStateRepo.exists()) {
    viewState = viewStateRepo.load();
  } else {
    viewState = new ViewState();
  }

  if (gameStateRepo.exists()) {
    game = gameStateRepo.load();
    initGame();
  }

  document.getElementById('start-form__new-game').addEventListener('click', event => {
    const newGameForm = <HTMLFormElement> document.getElementById('start-form');
    const players = parseInt(newGameForm.elements["players"].value);
    const authority = parseInt(newGameForm.elements["authority"].value);

    game = new Game(players, authority);

    initGame()

    event.preventDefault();
  });

  document.getElementById('in-game-menu__new-game').addEventListener('click', event => {
    controller.cleanup();
    gameStateRepo.clear();
    game = null;
    controller = null;

    START_PAGE.hidden = false;
    GAME_PAGE.hidden = true;
    IN_GAME_MENU.hidden = true;
  })

  IN_GAME_MENU_TOGGLE_BUTTON.addEventListener('click', event => {
    IN_GAME_MENU.hidden = !IN_GAME_MENU.hidden;
  });

  if (document.fullscreenEnabled) {

    if (document.fullscreenElement !== null) {
      FULL_SCREEN_ACTIVATION_BUTTON.hidden = true;
    }

    document.addEventListener('fullscreenchange', event => {
      FULL_SCREEN_ACTIVATION_BUTTON.hidden = document.fullscreenElement !== null;
    });

    FULL_SCREEN_ACTIVATION_BUTTON.addEventListener('click', event => {
      document.body.requestFullscreen();
    });

  } else {
    FULL_SCREEN_ACTIVATION_BUTTON.hidden = true;
  }

  let promptEvent : BeforeInstallPromptEvent = null;

  window.addEventListener('beforeinstallprompt', (event) => {
    if (promptEvent === null) {
      document.getElementById('install-section').hidden = false;
      promptEvent = <BeforeInstallPromptEvent> event;
    }
  });

  document.getElementById('install-app-button').addEventListener('click', async () => {
    try {
      promptEvent.prompt();

      const choice = await promptEvent.userChoice;

      if (choice.outcome === 'accepted') {
        document.getElementById('install-section').hidden = true;
        document.getElementById('install-event-outcome').hidden = false;
        document.getElementById('install-event-outcome').innerHTML
          = "Thank you for installing the app. You should be able to find it on your device now.";
      } else {
        document.getElementById('install-section').hidden = true;
        document.getElementById('install-event-outcome').hidden = false;
        document.getElementById('install-event-outcome').innerHTML
          = "You declined the install pompt. If you still wish to install the app, please refresh the page.";
      }
    } catch (ignored) {}

  })

});

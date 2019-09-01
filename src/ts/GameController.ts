import { Turn } from './Turn';
import { Game } from './Game';

import { ViewState } from './ViewState';

import { ViewStateRepo } from './ViewStateRepo';

import { GameStateRepo } from './GameStateRepo';

import { PlayerControllerElement } from './PlayerControllerElement';
import { PlayerHistoryElement } from './PlayerHistoryElement';

export class GameController {
  private readonly PLAYER_CONTAINER: HTMLElement = document.getElementById('players-list');
  private readonly HISTORY_TOGGLE_BUTTON: HTMLElement = document.getElementById('turn-menu__toggle-history');
  private readonly NEXT_TURN_BUTTON: HTMLElement = document.getElementById('turn-menu__complete-turn');

  private readonly _playerElements: PlayerControllerElement[] = [];
  private readonly _game: Game;

  private renderedTurns: Turn[] = [];
  private turnHistoryIndex = 0;
  private triggerHistoryUpdate = false;
  private showHistoryPrev = undefined;

  private animationRequestId = null;

  private readonly viewState : ViewState;
  private readonly viewStateRepo : ViewStateRepo;

  constructor(
    game: Game,
    viewState: ViewState,
    gameStateRepo: GameStateRepo,
    viewStateRepo: ViewStateRepo
  ) {

    this.viewState = viewState;
    this.viewStateRepo = viewStateRepo;

    this._game = game;

    gameStateRepo.save(game);

    this.turnHistoryIndex = game.turns.length - 1;

    while (this.PLAYER_CONTAINER.hasChildNodes()) {
      this.PLAYER_CONTAINER.removeChild(this.PLAYER_CONTAINER.lastChild);
    }

    this.PLAYER_CONTAINER.dataset.nPlayers = game.nPlayers.toString();

    for (let i = 0; i < game.nPlayers; i++) {
      const playerElement = <PlayerControllerElement>document.createElement('player-controller');
      this.PLAYER_CONTAINER.appendChild(playerElement);
      this._playerElements.push(playerElement);

      playerElement.addEventListener('increase-authority', () => {
        game.currentTurn.changePlayerAuthorityDeltaByDelta(i, 1);
        gameStateRepo.save(game);
      });

      playerElement.addEventListener('decrease-authority', () => {
        game.currentTurn.changePlayerAuthorityDeltaByDelta(i, -1);
        gameStateRepo.save(game);
      });

      playerElement.addEventListener('history-next', () => {
        this.turnHistoryIndex++;
      });

      playerElement.addEventListener('history-prev', () => {
        this.turnHistoryIndex--;
      });
    }

    this.NEXT_TURN_BUTTON.addEventListener('click', () => {
      game.completeCurrentTurn();
      this.turnHistoryIndex = game.turns.length - 1;
      gameStateRepo.save(game);
    });

    this.HISTORY_TOGGLE_BUTTON.addEventListener('click', () => {
      this.viewState.showHistory = !this.viewState.showHistory;
      viewStateRepo.save(viewState);
    });

    window.addEventListener('resize', () => {
      this.triggerHistoryUpdate = true;
    });

  }
  updateView() {

    for (let i = 0; i < this._game.nPlayers; i++) {
      const element = this._playerElements[i];
      const health = this._game.state.authority[i];
      const delta = this._game.state.deltas[i];
      element.setAuthority(health);
      element.setAuthorityDelta(delta);
    }

    if (this.renderedTurns.length != this._game.turns.length) {
      const turnsToRender: Turn[] = this._game.turns.slice(this.renderedTurns.length);
      for (let turn of turnsToRender) {
        for (let i = 0; i < this._game.nPlayers; i++) {
          const element: PlayerControllerElement = this._playerElements[i];
          const historyElement = <PlayerHistoryElement>document.createElement('player-history');
          historyElement.setAuthority(turn.authority[i]);
          historyElement.setAuthorityDelta(turn.deltas[i]);
          element.addHistory(historyElement);
        }
      }
      for (let i = 0; i < this._game.nPlayers; i++) {
          const element: PlayerControllerElement = this._playerElements[i];
          element.historyIndex = this._game.turns.length - 1;
          this.triggerHistoryUpdate = true;
      }
      this.renderedTurns = this._game.turns.slice();
    }

    if (this._game.state.deltas.some(d => d !== 0)) {
      this.NEXT_TURN_BUTTON.hidden = false;
    } else {
      this.NEXT_TURN_BUTTON.hidden = true;
    }

    if (this.showHistoryPrev === this.viewState.showHistory || this.triggerHistoryUpdate) {
      for (let i = 0; i < this._game.nPlayers; i++) {
        const element: PlayerControllerElement = this._playerElements[i];
        element.historyHidden = !this.viewState.showHistory;
      }
      if (!this.showHistoryPrev) {
        this.HISTORY_TOGGLE_BUTTON.innerHTML = 'Show history';
      }
      else {
        this.HISTORY_TOGGLE_BUTTON.innerHTML = 'Hide history';
      }
      this.showHistoryPrev = this.viewState.showHistory;
    }

    for (let i = 0; i < this._game.nPlayers; i++) {
      const element: PlayerControllerElement = this._playerElements[i];
      element.historyIndex = this.turnHistoryIndex;
    }
  }

  start() {
    const refresh = () => {
      this.updateView();
      this.animationRequestId = window.requestAnimationFrame(refresh);
    }
    window.requestAnimationFrame(refresh);
  }

  cleanup() {
    while (this.PLAYER_CONTAINER.firstChild) {
        this.PLAYER_CONTAINER.removeChild(this.PLAYER_CONTAINER.firstChild);
    }

    window.cancelAnimationFrame(this.animationRequestId);
  }
}

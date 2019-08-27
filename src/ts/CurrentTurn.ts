import { Game } from "./Game";

export class CurrentTurn {
  private readonly _deltas: number[];
  readonly game: Game;

  constructor(game: Game) {
    this.game = game;
    this._deltas = new Array<number>(game.nPlayers).fill(0);
  }

  changePlayerAuthorityDeltaByDelta(playerNumber: number, delta: number) {
    this._deltas[playerNumber] += delta;
  }
  
  get deltas(): readonly number[] {
    return this._deltas.slice();
  }
}

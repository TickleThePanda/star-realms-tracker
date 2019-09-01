import { jsonObject, jsonArrayMember } from "typedjson";

import { Game } from "./Game";

@jsonObject({
    initializer: () => Object.create(CurrentTurn.prototype)
})
export class CurrentTurn {
  @jsonArrayMember(Number)
  private readonly _deltas: number[];

  constructor(game: Game) {
    this._deltas = new Array<number>(game.nPlayers).fill(0);
  }

  changePlayerAuthorityDeltaByDelta(playerNumber: number, delta: number) {
    this._deltas[playerNumber] += delta;
  }

  get deltas(): readonly number[] {
    return this._deltas.slice();
  }
}

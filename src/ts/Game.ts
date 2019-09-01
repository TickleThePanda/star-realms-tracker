import { jsonObject, jsonMember, jsonArrayMember } from 'typedjson';

import { Turn } from './Turn';
import { CurrentTurn } from './CurrentTurn';


@jsonObject
export class Game {
  @jsonArrayMember(Turn)
  private readonly _turns: Turn[];
  @jsonMember({ constructor: Number})
  readonly nPlayers: number;
  @jsonMember({ constructor: CurrentTurn })
  private _currentTurn: CurrentTurn;

  constructor(nPlayers?: number, startingAuthority?: number) {
    this.nPlayers = nPlayers;
    this._turns = [Turn.createStartTurn(nPlayers, startingAuthority)];
    this._currentTurn = new CurrentTurn(this);
  }

  completeCurrentTurn(): Turn {
    const turn = this.state;
    this._turns.push(turn);
    this._currentTurn = new CurrentTurn(this);
    return turn;
  }

  get currentTurn(): CurrentTurn {
    return this._currentTurn;
  }

  get lastTurn(): Turn {
    return this.turns[this._turns.length - 1];
  }

  get state(): Turn {
    return Turn.createFromState(this.turns[this._turns.length - 1], this.currentTurn);
  }

  get turns(): readonly Turn[] {
    return this._turns.slice();
  }

}

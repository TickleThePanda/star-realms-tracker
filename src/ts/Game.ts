import { ITurn, Turn, StartTurn } from './Turn';
import { CurrentTurn } from './CurrentTurn';

export class Game {
  private readonly _turns: ITurn[];
  readonly nPlayers: number;
  private _currentTurn: CurrentTurn;

  constructor(nPlayers: number, startingAuthority: number) {
    this.nPlayers = nPlayers;
    this._turns = [new StartTurn(nPlayers, startingAuthority)];
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
    return new Turn(this.turns[this._turns.length - 1], this.currentTurn);
  }

  get turns(): readonly Turn[] {
    return this._turns.slice();
  }

  on(event: string, f: (turn: Turn) => void) {
    
  }
}

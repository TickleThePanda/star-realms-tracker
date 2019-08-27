import { CurrentTurn } from './CurrentTurn';

export interface ITurn {
  readonly deltas: readonly number[];
  readonly authority: readonly number[];
}

export class Turn implements ITurn {
  
  readonly deltas: readonly number[];
  readonly authority: readonly number[];

  constructor(prevTurn : Turn, currentTurn: CurrentTurn) {
    this.deltas = currentTurn.deltas;
    this.authority = prevTurn.authority.map((e, i) => e + currentTurn.deltas[i]);
  }
}

export class StartTurn implements ITurn {

  readonly deltas: readonly number[];
  readonly authority: readonly number[];

  constructor(nPlayers: number, startingAuthority: number) {
    this.deltas = new Array<number>(nPlayers).fill(0);
    this.authority = new Array<number>(nPlayers).fill(startingAuthority);
  }
}

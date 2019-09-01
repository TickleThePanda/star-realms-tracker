import { CurrentTurn } from './CurrentTurn';
import { jsonObject, jsonArrayMember } from 'typedjson';

@jsonObject({
    initializer: () => Object.create(Turn.prototype)
})
export class Turn {

  @jsonArrayMember(Number)
  readonly deltas: readonly number[];
  @jsonArrayMember(Number)
  readonly authority: readonly number[];

  constructor(deltas: readonly number[], authority: readonly number[]) {
    this.deltas = deltas;
    this.authority = authority;
  }

  static createFromState(prevTurn: Turn, currentTurn: CurrentTurn): Turn {
    const deltas = currentTurn.deltas;
    const authority = prevTurn.authority.map((e, i) => e + currentTurn.deltas[i]);

    return new Turn(deltas, authority);
  }

  static createStartTurn(nPlayers: number, startingAuthority: number): Turn {
    const deltas = new Array<number>(nPlayers).fill(0);
    const authority = new Array<number>(nPlayers).fill(startingAuthority);

    return new Turn(deltas, authority);
  }
}

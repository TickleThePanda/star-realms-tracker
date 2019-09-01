import { Game } from "./Game";
import { TypedJSON } from 'typedjson';

const GameJSON = new TypedJSON(Game);

export class GameStateRepo {

  private readonly ref : string;

  constructor(ref: string) {
    this.ref = ref;
  }

  exists(): boolean {
    return localStorage.getItem(this.ref) !== null;
  }

  save(game: Game) {
    localStorage.setItem(this.ref, GameJSON.stringify(game));
  }

  load(): Game {
    return GameJSON.parse(localStorage.getItem(this.ref));
  }

  clear() {
    localStorage.removeItem(this.ref);
  }
}
import { ViewState } from "./ViewState";

export class ViewStateRepo {

  private readonly ref : string;

  constructor(ref: string) {
    this.ref = ref;
  }

  exists(): boolean {
    return localStorage.getItem(this.ref) !== null;
  }

  save(game: ViewState) {
    localStorage.setItem(this.ref, JSON.stringify(game));
  }

  load(): ViewState {
    return JSON.parse(localStorage.getItem(this.ref));
  }

}
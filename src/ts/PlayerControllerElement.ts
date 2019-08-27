import { PlayerHistoryElement } from "./PlayerHistoryElement";

function getPlayerTemplateContent() : DocumentFragment {
  return (<HTMLTemplateElement> document.getElementById('player-controller')).content;
}

export class PlayerControllerElement extends HTMLElement {

  private _historyHidden: boolean;
  private _turn: number = 0;

  private readonly HISTORY_NEXT_BUTTON : HTMLElement;
  private readonly HISTORY_PREV_BUTTON : HTMLElement;

  private readonly AUTHORITY_INC_BUTTON : HTMLElement;
  private readonly AUTHORITY_DEC_BUTTON : HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
      .appendChild(getPlayerTemplateContent().cloneNode(true));

    this.HISTORY_NEXT_BUTTON = this.shadowRoot.querySelector('#history-next');
    this.HISTORY_PREV_BUTTON = this.shadowRoot.querySelector('#history-prev');

    this.AUTHORITY_INC_BUTTON = this.shadowRoot.querySelector('#increase-authority');
    this.AUTHORITY_DEC_BUTTON = this.shadowRoot.querySelector('#decrease-authority');

  }

  setAuthority(authority: number) {
    const element = this.shadowRoot.querySelector('#authority');
    const currentValue = element.innerHTML;
    const newValue = authority.toString();
    if (currentValue !== newValue) {
      element.innerHTML = newValue;
    }
  }

  setAuthorityDelta(authority: number) {
    const element = this.shadowRoot.querySelector('#authority-delta');
    const currentValue = element.innerHTML;
    const newValue = authority.toString();
    if (currentValue !== newValue) {
      element.innerHTML = newValue;
      if (authority === 0) {
        return;
      } else if (authority > 0) {
        element.innerHTML = "+" + newValue;
        element.classList.add('increase');
      } else {
        element.innerHTML = newValue;
        element.classList.add('decrease');
      }
    }
  }

  addHistory(history: PlayerHistoryElement) {
    const element = this.shadowRoot.querySelector('#history');
    element.appendChild(history);
  }

  private getHistoryElements(): HTMLElement[] {
    return Array.from(
        this.shadowRoot
          .querySelector('#history')
          .querySelectorAll('player-history')
      );
  }

  private updateHistoryControlsVisibility() {
    const historyElements = this.getHistoryElements();

    if (this._historyHidden === true) {
      this.HISTORY_NEXT_BUTTON.hidden = true;
      this.HISTORY_PREV_BUTTON.hidden = true;  
    } else {
      if (this._turn === 0) {
        this.HISTORY_PREV_BUTTON.hidden = true;
      } else {
        this.HISTORY_PREV_BUTTON.hidden = false;
      }

      if (this._turn === historyElements.length - 1) {
        this.HISTORY_NEXT_BUTTON.hidden = true;
      } else {
        this.HISTORY_NEXT_BUTTON.hidden = false;
      }
    }
  }

  private updateHistoryView() {
    const historyElements : HTMLElement[] = this.getHistoryElements();   
    const turnToShow = historyElements[this._turn];

    turnToShow.scrollIntoView({
      inline: "center"
    })

    this.updateHistoryControlsVisibility();
  }

  get historyIndex() {
    return this._turn;
  }

  set historyIndex(turn: number) {
    if (this._turn !== turn) {
      this._turn = turn;

      this.updateHistoryView();
    }
  }

  get historyHidden() {
    return this._historyHidden;
  }

  set historyHidden(hidden: boolean) {
    this._historyHidden = hidden;
    const historyContainer: HTMLElement = this.shadowRoot.querySelector('#history');
    historyContainer.hidden = hidden;

    this.updateHistoryView();
  }

  addEventListener(listener: string, f) {
    if (listener === 'increase-authority') {
      this.AUTHORITY_INC_BUTTON.addEventListener('click', f);
      return;
    }
    if (listener === 'decrease-authority') {
      this.AUTHORITY_DEC_BUTTON.addEventListener('click', f);
      return;
    }
    if (listener === 'history-next') {
      this.HISTORY_NEXT_BUTTON.addEventListener('click', f);
      return; 
    }
    if (listener === 'history-prev') {
      this.HISTORY_PREV_BUTTON.addEventListener('click', f);
      return;
    }
    super.addEventListener(listener, f);
  }
}

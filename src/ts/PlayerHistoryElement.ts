function getPlayerHistoryTemplateContent() : DocumentFragment {
  return (<HTMLTemplateElement> document.getElementById('player-history')).content;
}

export class PlayerHistoryElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' })
      .appendChild(getPlayerHistoryTemplateContent().cloneNode(true));
  }

  setAuthority(authority: number) {
    const element = this.shadowRoot.querySelector('#authority');

    element.innerHTML = authority.toString();
  }

  setAuthorityDelta(authority: number) {
    const element = this.shadowRoot.querySelector('#authority-delta');

    if (authority === 0) {
      return;
    } else if (authority > 0) {
      element.innerHTML = "+" + authority.toString();
      element.classList.add('increase');
    } else {
      element.innerHTML = authority.toString();
      element.classList.add('decrease');
    }
  }

Z    
}
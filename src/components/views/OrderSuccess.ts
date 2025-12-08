import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";



export class OrderSuccess extends Component<HTMLElement> {
  continueButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);

    this.continueButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.continueButton.addEventListener('click', () => {
      this.events.emit('continueButton:click');
    })
  }
}
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IOrderSuccess {
  sum: number;  
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected continueButton: HTMLButtonElement;
  protected purchaseSum: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);

    this.continueButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.purchaseSum = ensureElement<HTMLElement>('.order-success__description', this.container);

    this.continueButton.addEventListener('click', () => {
      this.events.emit('shopping:continue');
    })
  }

  set sum(value: number) {
    this.purchaseSum.textContent = `Списано ${value} синапсов`;
  }
}
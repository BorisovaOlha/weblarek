import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface ICardBasket {
  index: number;
};

export class CardBasket extends Card<ICardBasket> {

  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;


  constructor(protected events: IEvents, container: HTMLElement){
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('basketItem:deleted');
    })
  }
  
  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

}
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component"
import { IEvents } from "../base/Events";

export interface IBasketView {
  price: number | null;
  content: HTMLElement[];
  buttonDisabled: boolean;
}

export class BasketView extends Component<IBasketView> {
  protected basketButton: HTMLButtonElement;
  protected basketPriceElement: HTMLElement;
  protected contentContainer: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.basketPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.contentContainer = ensureElement<HTMLElement>('.basket__list', this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basketButton:clicked');
    })
  }

  set price(value: number | null) {
    this.basketPriceElement.textContent = value !== null ? `${value} синапсов` : `0 синапсов`;
  };

  set content(items: HTMLElement[]) {
    this.contentContainer.replaceChildren(...items);
  };

  set buttonDisabled(isDisabled: boolean) {
    this.basketButton.disabled = isDisabled;
  }
}
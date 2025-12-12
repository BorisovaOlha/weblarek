import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";

type CategoryKey = keyof typeof categoryMap;
export type TCardPreview = Pick<IProduct, 'category' | 'image' | 'description' >;

export class CardPreview extends Card<TCardPreview> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected textElement: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
      super(container);

      this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
      this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
      this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
      this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

      this.cardButton.addEventListener('click', () => {
        this.events.emit('cardButton:click');
      })
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }
  
  set image(value: string) {
    this.setImage(this.imageElement, value);
  }

  set description(value: string) {
    this.textElement.textContent = String(value);
  }

  changeButton(inBasket: boolean) {
    this.cardButton.textContent = inBasket ? 'Удалить из корзины' : 'В корзину';
  }

  disableButton(isDisabled: boolean) {
    this.cardButton.disabled = isDisabled;
    this.cardButton.textContent = 'Недоступно';
  }
}
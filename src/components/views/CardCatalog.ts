import { IProduct, ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Card } from "../views/Card";
import { categoryMap } from "../../utils/constants";


type CategoryKey = keyof typeof categoryMap;
export type TCardCatalog = Pick<IProduct, `category` | `image`>;

export class CardCatalog extends Card<TCardCatalog> {
  
  protected categoryElement: HTMLElement;  
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);    
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }  
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
}
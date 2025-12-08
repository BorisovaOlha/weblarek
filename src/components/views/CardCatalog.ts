import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Card } from "../views/Card";
import { categoryMap } from "../../utils/constants";


export interface ICardActions {
  onClick: () => void;
}

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

///* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
//     export const categoryMap = {
//   'софт-скил': 'card__category_soft',
//   'хард-скил': 'card__category_hard',
//   'кнопка': 'card__category_button',
//   'дополнительное': 'card__category_additional',
//   'другое': 'card__category_other',
// };

}
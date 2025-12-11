import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Basket {
  private basketItems: IProduct[] = [];
  
  constructor(protected events: IEvents) {}

  getBasketItems(): IProduct[] {
    return this.basketItems;
  }
  
  addItem(item: IProduct): void {
    this.basketItems.push(item);
    this.events.emit('basket:changed', this.getBasketItems());
  }
  
  removeItem(item: IProduct): void {  
    this.basketItems = this.basketItems.filter(el => el.id !== item.id);
    this.events.emit('basket:changed', this.getBasketItems());   
  }
  
  emptyBasket(): void {
    this.basketItems.length = 0;
    this.events.emit('basket:changed', this.getBasketItems());
  }
  
  getTotalPrice(): number {
    let totalPrice = 0;

    this.basketItems.forEach(el => {
      totalPrice += el.price ?? 0;
    })

    return totalPrice;
  }
  
  getItemsTotal(): number {
    return this.basketItems.length;
  }
  
  checkItemById(id: string): boolean {
    return this.basketItems.some(el => el.id === id);
  }
}


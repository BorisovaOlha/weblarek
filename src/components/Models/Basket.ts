import { IProduct } from '../../types/index';

export class Basket {
  private basketItems: IProduct[] = [];
  
  constructor() {}

  getBasketItems(): IProduct[] {
    return this.basketItems;
  }
  
  addItem(item: IProduct): void {
    this.basketItems.push(item);
  }
  
  removeItem(item: IProduct): void {  
    this.basketItems = this.basketItems.filter(el => el.id !== item.id);   
  }
  
  emptyBasket(): void {
    this.basketItems.length = 0;
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


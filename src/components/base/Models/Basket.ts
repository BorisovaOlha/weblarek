import { IProduct } from '../../../types/index';

export class Basket {
  private basketItems: IProduct[] = [];


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
    const prices = this.basketItems.map(el => {
      return el.price ?? 0;
    });
  
    const totalPrice = prices.reduce((a, b) => 
      a + b, 0
    );
  
    return totalPrice;
  
  }
  
  getItemsTotal(): number {
    return this.basketItems.length;
  }
  
  checkItemById(id: string): boolean {
    return this.basketItems.some(el => el.id === id);
  }
}


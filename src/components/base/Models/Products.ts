import { IProduct } from '../../../types/index';


export class Products {
  private items!: IProduct[];
  private selectedItem!: IProduct;

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  setItem(selectedItem: IProduct): void {
    this.selectedItem = selectedItem;
  }
  
  getItem(): IProduct {
    return this.selectedItem;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }
}
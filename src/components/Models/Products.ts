import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';


export class Products {
  private items: IProduct[] = [];
  private selectedItem!: IProduct;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:changed');
  }

  getItems(): IProduct[] {
    return this.items;
  }

  setItem(selectedItem: IProduct): void {
    this.selectedItem = selectedItem;
    this.events.emit('selectedProduct:changed', this.getSelectedItem());
  }
  
  getSelectedItem(): IProduct {
    return this.selectedItem;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }
}
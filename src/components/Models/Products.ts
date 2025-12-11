import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';


export class Products {
  private items: IProduct[] = [];
  private selectedItem!: IProduct;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:changed'); // @TODO Нужен здесь this.items? или this.getItems()
  }

  getItems(): IProduct[] {
    return this.items;
  }

  setItem(selectedItem: IProduct): void {
    this.selectedItem = selectedItem;
    this.events.emit('selectedProduct:changed', this.getItem());
  }
  
  getItem(): IProduct {
    return this.selectedItem;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }
}
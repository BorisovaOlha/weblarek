import { IBuyer } from '../../types/index';
import { IEvents } from '../base/Events';

export class Buyer {
  private payment: "card" | "cash" | "" = "";
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  constructor(protected events: IEvents) {}

  setData(key: string, value: string): void {
    switch (key) {
      case "payment":
        this.payment = value as "card" | "cash" | "";
        break;
      case "email":
        this.email = value;
        break;
      case "phone":
        this.phone = value;
        break;
      case "address":
        this.address = value;
        break;
      default:
        console.log("Couldn't save the data");
    }
    this.events.emit('buyerData:changed', this.getData());   
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    }
  }

  emptyData(): void {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";

    this.events.emit('buyerData:changed', this.getData());
  }

  
/*  Как один из вариантов решения задачи валидации может быть метод, который вернет объект.
В объекте могут присутствовать поля, соответствующие полям класса, значениями у которых будет текст ошибки.
Если же поле не содержит ошибок, то такое свойство в объекте может отсутствовать.*/

// Может, передавать в него сразу введенные пользователем данные?
// Посмотреть, как работает в консоли, какой объект возвращает.

  checkData(): Partial<IBuyer> {
    const checkedData: Partial<IBuyer> = {};

    if (this.payment === undefined || this.payment === null || this.payment === "") {
      checkedData.payment = 'Не выбран вид оплаты' as any;
    }
         
    if (this.email === undefined || this.email === null || this.email === "") {
      checkedData.email = 'Укажите емэйл';
    }
         
    if (this.phone === undefined || this.phone === null || this.phone === "") {
      checkedData.phone = 'Укажите номер телефона';
    }
         
    if (this.address === undefined || this.address === null || this.address === "") {
      checkedData.address = 'Укажите адрес';
    }

    // Добавить событие?
    
    return checkedData;
    }  
}




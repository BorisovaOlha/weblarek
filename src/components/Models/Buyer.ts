import { IBuyer } from '../../types/index';

export class Buyer {
  private payment: "card" | "cash" | "" = "";
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  constructor() {}

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
  }

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

     return checkedData;
    }  
}




import { IBuyer } from '../../../types/index';

export class Buyer {
  private payment!: "card" | "cash" | "";
  private email!: string;
  private phone!: string;
  private address!: string;


  setData(data: IBuyer): void {
    this.payment = data.payment;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
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

  checkData(data: IBuyer): object {
    const checkedData: {
      payment?: string,
      email?: string,
      phone?: string,
      address?: string
    } = {};

    for (const [key, value] of Object.entries(data)) {
         if (value === undefined || value === null || value === "") {
            if (key === "payment") {
                checkedData.payment = 'Не выбран вид оплаты';
            }
         
            if (key === "email") {
                checkedData.email = 'Укажите емэйл';
            }
         
            if (key === "phone") {
                checkedData.phone = 'Укажите номер телефона';
            }
         
            if (key === "address") {
                checkedData.address = 'Укажите адрес';
            }           
         }
    }
    return checkedData;
  }
}




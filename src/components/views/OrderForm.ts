import { ensureAllElements, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IBuyer } from "../../types";
import { Form } from "./Form";

export type TOrderForm = Pick<IBuyer, 'payment'>

export class OrderForm extends Form<TOrderForm> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;
    

    constructor(protected events: IEvents, container: HTMLElement) {
      super(events, container);

      this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons .button', this.container);
      this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

      this.paymentButtons.forEach(button => { 
          button.addEventListener('click', () => {
              this.events.emit('payment:select', {key: 'payment', value: button.name});
          });
      });
      
      this.addressInput.addEventListener('input', () => {
        this.events.emit('address:input', {key: 'address', value: this.addressInput.value});
      })

      this.submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.events.emit('order:continue');
      })
    }

    set payment(value: "" | "card" | "cash") {
      this.paymentButtons.forEach(button => {
        button.classList.toggle('button_alt-active', button.name === value);
      })
    }    
}

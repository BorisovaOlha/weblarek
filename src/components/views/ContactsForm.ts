import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";
import { IBuyer } from "../../types";

export type TContactsForm = Pick<IBuyer, 'email' | 'phone'> & {
  ready: boolean;
  error: string;
};

export class ContactsForm extends Form<TContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.emailInput.addEventListener('input', () => {
      this.events.emit('email:input', {key: 'email', value: this.emailInput.value});      
    })

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('phone:input', {key: 'phone', value: this.phoneInput.value});
    })

    this.submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.events.emit('order:pay');
    })
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
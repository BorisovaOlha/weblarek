import { IEvents } from "../base/Events";
import { ensureElement, ensureAllElements } from "../../utils/utils";
import { Component } from "../base/Component";


export class Form<T> extends Component<T> {
  protected inputElements: HTMLInputElement[];
  protected submitButton: HTMLButtonElement;
  protected errorField: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);

    this.inputElements = ensureAllElements<HTMLInputElement>('.form__input', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>("[type='submit']", this.container);
    this.errorField = ensureElement<HTMLElement>('.form__errors', this.container);

    // @TODO Нужно ли вообще это событие?
    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('form:submit');
    });
  }

  set error(errorMessage: string) {
    this.errorField.textContent = errorMessage;
  }
    // Когда форма готова к отправке: текст в инпутах становятся белыми, кнопка Далее и Оформить теряют disabled
  set ready(isReady: boolean) {
    this.submitButton.disabled = !isReady;
  }
}
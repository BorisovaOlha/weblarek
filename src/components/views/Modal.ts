import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected contentContainer: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    
    this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:closed');
    })

    this.container.addEventListener('click', (event)=> {
      if(event.target === this.container) {
        this.events.emit('modal:closed');
      }
    })
  }

  showModal(isVisible: boolean) {
    this.container.classList.toggle('modal_active', isVisible);
  }

  set content(modalContent: HTMLElement) {
    this.contentContainer.replaceChildren(modalContent);
  }
}
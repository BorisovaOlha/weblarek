import { Component } from "../base/Component";

interface IGalleryData {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  
  constructor(protected catalogElement: HTMLElement){
    super(catalogElement);
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  };
}
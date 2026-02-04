import { Component } from '../base/Component';
import { IProduct } from '../../types';

/**
 * Интерфейс для данных галереи
 */
interface IGalleryData {
  items: HTMLElement[];
}

/**
 * Компонент галереи (контейнер для карточек каталога)
 */
export class Gallery extends Component<IGalleryData> {
  /**
   * Устанавливает карточки товаров в галерею
   */
  set items(value: HTMLElement[]) {
    this.container.replaceChildren(...value);
  }

  render(data: IGalleryData): HTMLElement {
    this.items = data.items;
    return this.container;
  }
}
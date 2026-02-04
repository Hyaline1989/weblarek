import { Card } from './Card';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * Карточка товара в каталоге
 */
export class CatalogCard extends Card<IProduct> {
  private events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    
    // Устанавливаем обработчик клика
    this.container.addEventListener('click', () => {
      this.events.emit('card:select', this.container);
    });
  }

  /**
   * Устанавливает данные товара
   */
  set id(value: string) {
    this.container.dataset.id = value;
  }

  render(data: IProduct): HTMLElement {
    super.render(data);
    
    this.id = data.id;
    this.title = data.title;
    this.image = data.image;
    this.category = data.category;
    this.price = data.price;
    
    // Блокируем кнопку если товар недоступен
    if (data.price === null) {
      this.container.classList.add('card_disabled');
    } else {
      this.container.classList.remove('card_disabled');
    }
    
    return this.container;
  }
}
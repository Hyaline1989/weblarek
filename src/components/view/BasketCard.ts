import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * Интерфейс для данных карточки корзины
 */
interface IBasketCardData {
  item: IProduct;
  index: number;
}

/**
 * Карточка товара в корзине
 */
export class BasketCard extends Component<IBasketCardData> {
  private events: EventEmitter;
  private _index: HTMLElement;
  private _title: HTMLElement;
  private _price: HTMLElement;
  private _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    
    this._index = this.container.querySelector('.basket__item-index');
    this._title = this.container.querySelector('.card__title');
    this._price = this.container.querySelector('.card__price');
    this._deleteButton = this.container.querySelector('.basket__item-delete');
    
    // Обработчик удаления товара
    this._deleteButton.addEventListener('click', () => {
      const productId = this.container.dataset.id;
      this.events.emit('basket:remove', { id: productId });
    });
  }

  /**
   * Устанавливает индекс товара
   */
  set index(value: number) {
    if (this._index) {
      this._index.textContent = String(value);
    }
  }

  /**
   * Устанавливает заголовок товара
   */
  set title(value: string) {
    if (this._title) {
      this._title.textContent = value;
    }
  }

  /**
   * Устанавливает цену товара
   */
  set price(value: number) {
    if (this._price) {
      this._price.textContent = `${value} синапсов`;
    }
  }

  /**
   * Устанавливает ID товара
   */
  set id(value: string) {
    this.container.dataset.id = value;
  }

  render(data: IBasketCardData): HTMLElement {
    this.id = data.item.id;
    this.index = data.index;
    this.title = data.item.title;
    this.price = data.item.price || 0;
    
    return this.container;
  }
}
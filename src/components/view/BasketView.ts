import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * Интерфейс для данных корзины
 */
interface IBasketData {
  items: HTMLElement[];
  total: number;
}

/**
 * Компонент корзины
 */
export class BasketView extends Component<IBasketData> {
  private events: EventEmitter;
  private _list: HTMLElement;
  private _total: HTMLElement;
  private _button: HTMLButtonElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    
    this._list = this.container.querySelector('.basket__list');
    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');
    
    // Обработчик кнопки оформления заказа
    this._button.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  /**
   * Устанавливает список товаров
   */
  set items(value: HTMLElement[]) {
    this._list.replaceChildren(...value);
  }

  /**
   * Устанавливает общую сумму
   */
  set total(value: number) {
    if (this._total) {
      this._total.textContent = `${value} синапсов`;
    }
  }

  /**
   * Устанавливает состояние кнопки
   */
  set buttonState(value: boolean) {
    if (this._button) {
      this._button.disabled = !value;
    }
  }

  render(data: IBasketData): HTMLElement {
    this.items = data.items;
    this.total = data.total;
    this.buttonState = data.items.length > 0;
    
    return this.container;
  }
}
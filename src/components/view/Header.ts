import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

/**
 * Интерфейс для данных хедера
 */
interface IHeaderData {
  counter: number;
}

/**
 * Компонент хедера с корзиной
 */
export class Header extends Component<IHeaderData> {
  private events: EventEmitter;
  private _counter: HTMLElement;
  private _button: HTMLButtonElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    
    this._counter = this.container.querySelector('.header__basket-counter');
    this._button = this.container.querySelector('.header__basket');
    
    // Обработчик открытия корзины
    this._button.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  /**
   * Устанавливает счетчик товаров в корзине
   */
  set counter(value: number) {
    if (this._counter) {
      this._counter.textContent = String(value);
    }
  }

  render(data: IHeaderData): HTMLElement {
    this.counter = data.counter;
    return this.container;
  }
}
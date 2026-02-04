import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

/**
 * Интерфейс для данных успешного заказа
 */
interface ISuccessData {
  total: number;
}

/**
 * Компонент успешного оформления заказа
 */
export class SuccessView extends Component<ISuccessData> {
  private events: EventEmitter;
  private _description: HTMLElement;
  private _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    
    this._description = this.container.querySelector('.order-success__description');
    this._closeButton = this.container.querySelector('.order-success__close');
    
    // Обработчик закрытия
    this._closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  /**
   * Устанавливает сумму заказа
   */
  set total(value: number) {
    if (this._description) {
      this._description.textContent = `Списано ${value} синапсов`;
    }
  }

  render(data: ISuccessData): HTMLElement {
    this.total = data.total;
    return this.container;
  }
}
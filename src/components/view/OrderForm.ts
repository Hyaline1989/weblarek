import { Form } from './Form';
import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * Интерфейс для данных формы заказа
 */
interface IOrderFormData {
  payment?: string;
  address?: string;
  valid: boolean;
  errors: string;
}

/**
 * Форма оформления заказа (шаг 1)
 */
export class OrderForm extends Form<IOrderFormData> {
  private _paymentButtons: NodeListOf<HTMLButtonElement>;
  private _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);
    
    this._paymentButtons = this.container.querySelectorAll('.button_alt');
    this._addressInput = this.container.querySelector('input[name="address"]');
    
    // Обработчики выбора способа оплаты - только передаем данные в модель
    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        const payment = button.name;
        this.updatePaymentButtons(payment);
        this.events.emit('order.payment:change', { payment });
      });
    });
    
    // Обработчик изменения адреса - только передаем данные в модель
    this._addressInput.addEventListener('input', () => {
      this.events.emit('order.address:change', { address: this._addressInput.value });
    });
  }

  /**
   * Обновляет состояние кнопок оплаты (только отображение)
   */
  private updatePaymentButtons(selectedPayment: string) {
    this._paymentButtons.forEach(button => {
      if (button.name === selectedPayment) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }

  /**
   * Устанавливает способ оплаты (только отображение)
   */
  set payment(value: string) {
    this.updatePaymentButtons(value);
  }

  /**
   * Устанавливает адрес (только отображение)
   */
  set address(value: string) {
    this._addressInput.value = value;
  }

  /**
   * Очищает форму
   */
  clear(): void {
    // Сбрасываем отображение
    this._paymentButtons.forEach(button => {
      button.classList.remove('button_alt-active');
    });
    this._addressInput.value = '';
    this.valid = false;
    this.errors = '';
  }

  render(data: IOrderFormData): HTMLElement {
    // Только устанавливаем значения для отображения
    if (data.payment) this.payment = data.payment;
    if (data.address) this.address = data.address;
    
    // Валидация пришла из модели через Presenter
    this.valid = data.valid;
    this.errors = data.errors;
    
    return this.container;
  }
}
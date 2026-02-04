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
  private _selectedPayment: string = '';

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);
    
    this._paymentButtons = this.container.querySelectorAll('.button_alt');
    this._addressInput = this.container.querySelector('input[name="address"]');
    
    // Обработчики выбора способа оплаты
    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this._selectedPayment = button.name;
        this.updatePaymentButtons();
        this.validateForm();
        this.events.emit('order.payment:change', { payment: this._selectedPayment });
      });
    });
    
    // Обработчик изменения адреса
    this._addressInput.addEventListener('input', () => {
      this.validateForm();
      this.events.emit('order.address:change', { address: this._addressInput.value });
    });
  }

  /**
   * Обновляет состояние кнопок оплаты
   */
  private updatePaymentButtons() {
    this._paymentButtons.forEach(button => {
      if (button.name === this._selectedPayment) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }

  /**
   * Валидирует форму
   */
  private validateForm() {
    const isValid = this._selectedPayment !== '' && this._addressInput.value.trim() !== '';
    this.valid = isValid;
    return isValid;
  }

  /**
   * Устанавливает способ оплаты
   */
  set payment(value: string) {
    this._selectedPayment = value;
    this.updatePaymentButtons();
    this.validateForm();
  }

  /**
   * Устанавливает адрес
   */
  set address(value: string) {
    this._addressInput.value = value;
    this.validateForm();
  }

  /**
   * Возвращает данные формы
   */
  get data(): Partial<IBuyer> {
    return {
      payment: this._selectedPayment,
      address: this._addressInput.value
    };
  }

  /**
   * Очищает форму
   */
  clear(): void {
    this._selectedPayment = '';
    this.updatePaymentButtons();
    this._addressInput.value = '';
    this.valid = false;
    this.errors = '';
  }

  render(data: IOrderFormData): HTMLElement {
    if (data.payment) this.payment = data.payment;
    if (data.address) this.address = data.address;
    this.valid = data.valid;
    this.errors = data.errors;
    
    return this.container;
  }
}
import { Form } from './Form';
import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * Интерфейс для данных формы контактов
 */
interface IContactsFormData {
  email?: string;
  phone?: string;
  valid: boolean;
  errors: string;
}

/**
 * Форма контактов (шаг 2)
 */
export class ContactsForm extends Form<IContactsFormData> {
  private _emailInput: HTMLInputElement;
  private _phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);
    
    this._emailInput = this.container.querySelector('input[name="email"]');
    this._phoneInput = this.container.querySelector('input[name="phone"]');
    
    // Обработчики изменения полей
    this._emailInput.addEventListener('input', () => {
      this.validateForm();
      this.events.emit('contacts.email:change', { email: this._emailInput.value });
    });
    
    this._phoneInput.addEventListener('input', () => {
      this.validateForm();
      this.events.emit('contacts.phone:change', { phone: this._phoneInput.value });
    });
  }

  /**
   * Валидирует форму
   */
  private validateForm() {
    const emailValid = this._emailInput.value.trim() !== '';
    const phoneValid = this._phoneInput.value.trim() !== '';
    const isValid = emailValid && phoneValid;
    
    this.valid = isValid;
    return isValid;
  }

  /**
   * Устанавливает email
   */
  set email(value: string) {
    this._emailInput.value = value;
    this.validateForm();
  }

  /**
   * Устанавливает телефон
   */
  set phone(value: string) {
    this._phoneInput.value = value;
    this.validateForm();
  }

  /**
   * Возвращает данные формы
   */
  get data(): Partial<IBuyer> {
    return {
      email: this._emailInput.value,
      phone: this._phoneInput.value
    };
  }

  /**
   * Очищает форму
   */
  clear(): void {
    this._emailInput.value = '';
    this._phoneInput.value = '';
    this.valid = false;
    this.errors = '';
  }

  render(data: IContactsFormData): HTMLElement {
    if (data.email) this.email = data.email;
    if (data.phone) this.phone = data.phone;
    this.valid = data.valid;
    this.errors = data.errors;
    
    return this.container;
  }
}
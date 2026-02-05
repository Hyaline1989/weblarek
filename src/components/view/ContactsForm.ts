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
    
    // Обработчики изменения полей - только передаем данные в модель
    this._emailInput.addEventListener('input', () => {
      // Только передаем данные в модель, валидация будет в модели
      this.events.emit('contacts.email:change', { email: this._emailInput.value });
    });
    
    this._phoneInput.addEventListener('input', () => {
      // Только передаем данные в модель, валидация будет в модели
      this.events.emit('contacts.phone:change', { phone: this._phoneInput.value });
    });
  }

  /**
   * Устанавливает email (только отображение)
   */
  set email(value: string) {
    this._emailInput.value = value;
  }

  /**
   * Устанавливает телефон (только отображение)
   */
  set phone(value: string) {
    this._phoneInput.value = value;
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
    // Только устанавливаем значения для отображения
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    
    // Валидация пришла из модели через Presenter
    this.valid = data.valid;
    this.errors = data.errors;
    
    return this.container;
  }
}
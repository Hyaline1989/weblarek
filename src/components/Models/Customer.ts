import { IBuyer, IBuyerValidationErrors, TPayment } from '../../types';

/**
 * Класс для хранения данных покупателя
 * Ответственность: хранение и валидация данных покупателя
 */
export class Customer {
  private data: Partial<IBuyer> = {};

  /**
   * Конструктор класса
   * @param initialData - начальные данные покупателя (опционально)
   */
  constructor(initialData: Partial<IBuyer> = {}) {
    this.data = { ...initialData };
  }

  /**
   * Сохраняет данные покупателя
   * @param data - данные для сохранения
   */
  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
  }

  /**
   * Устанавливает способ оплаты
   * @param payment - способ оплаты
   */
  setPayment(payment: TPayment): void {
    this.data.payment = payment;
  }

  /**
   * Устанавливает email
   * @param email - email покупателя
   */
  setEmail(email: string): void {
    this.data.email = email;
  }

  /**
   * Устанавливает телефон
   * @param phone - телефон покупателя
   */
  setPhone(phone: string): void {
    this.data.phone = phone;
  }

  /**
   * Устанавливает адрес
   * @param address - адрес доставки
   */
  setAddress(address: string): void {
    this.data.address = address;
  }

  /**
   * Возвращает все данные покупателя
   * @returns данные покупателя
   */
  getData(): Partial<IBuyer> {
    return { ...this.data };
  }

  /**
   * Проверяет, заполнены ли все обязательные поля
   * @returns true если все поля заполнены, false если нет
   */
  isComplete(): boolean {
    return !!(this.data.payment && 
              this.data.email && 
              this.data.phone && 
              this.data.address);
  }

  /**
   * Валидирует данные покупателя
   * @returns объект с ошибками валидации (пустой объект если ошибок нет)
   */
  validate(): IBuyerValidationErrors {
    const errors: IBuyerValidationErrors = {};

    if (!this.data.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this.data.email || this.data.email.trim() === '') {
      errors.email = 'Введите email';
    }

    if (!this.data.phone || this.data.phone.trim() === '') {
      errors.phone = 'Введите телефон';
    }

    if (!this.data.address || this.data.address.trim() === '') {
      errors.address = 'Введите адрес доставки';
    }

    return errors;
  }

  /**
   * Проверяет, есть ли ошибки валидации
   * @returns true если есть ошибки, false если нет
   */
  hasErrors(): boolean {
    return Object.keys(this.validate()).length > 0;
  }

  /**
   * Очищает все данные покупателя
   */
  clear(): void {
    this.data = {};
  }

  /**
   * Проверяет, заполнено ли конкретное поле
   * @param field - поле для проверки
   * @returns true если поле заполнено, false если нет
   */
  isFieldFilled<K extends keyof IBuyer>(field: K): boolean {
    return !!(this.data[field] && this.data[field]!.toString().trim() !== '');
  }
}
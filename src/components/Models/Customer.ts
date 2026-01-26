import { IBuyer, IBuyerValidationErrors, TPayment } from '../../types';

/**
 * Класс для хранения данных покупателя
 * Ответственность: хранение и валидация данных покупателя
 */
export class Customer {
  private data: IBuyer;

  /**
   * Конструктор класса
   * @param initialData - начальные данные покупателя (опционально)
   */
  constructor(initialData: Partial<IBuyer> = {}) {
    // Инициализируем все поля с пустыми значениями по умолчанию
    this.data = {
      payment: initialData.payment || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      address: initialData.address || '',
    } as IBuyer; // Приводим к типу IBuyer, так как все поля гарантированно есть
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
   * Обновляет данные покупателя
   * @param data - частичные данные для обновления
   */
  updateData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.data.payment = data.payment;
    if (data.email !== undefined) this.data.email = data.email;
    if (data.phone !== undefined) this.data.phone = data.phone;
    if (data.address !== undefined) this.data.address = data.address;
  }

  /**
   * Возвращает все данные покупателя
   * @returns данные покупателя
   */
  getData(): IBuyer {
    return { ...this.data };
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

    if (!this.data.email?.trim()) {
      errors.email = 'Введите email';
    }

    if (!this.data.phone?.trim()) {
      errors.phone = 'Введите телефон';
    }

    if (!this.data.address?.trim()) {
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
    this.data = {
      payment: '',
      email: '',
      phone: '',
      address: '',
    } as IBuyer;
  }

  /**
   * Проверяет, заполнено ли конкретное поле
   * @param field - поле для проверки
   * @returns true если поле заполнено, false если нет
   */
  isFieldFilled<K extends keyof IBuyer>(field: K): boolean {
    const value = this.data[field];
    return typeof value === 'string' ? value.trim() !== '' : !!value;
  }
}
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
} 
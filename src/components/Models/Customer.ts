import { IBuyer, TBuyerErrors } from '../../types'; 
import { EventEmitter } from '../base/Events';

/** 
 * Класс для хранения данных покупателя 
 * Ответственность: хранение и валидация данных покупателя 
 */ 
export class Customer { 
  private data: IBuyer;
  private events: EventEmitter;

  /** 
   * Конструктор класса 
   * @param events - брокер событий
   * @param initialData - начальные данные покупателя (опционально) 
   */ 
  constructor(events: EventEmitter, initialData: Partial<IBuyer> = {}) { 
    this.events = events;
    
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
    let changed = false;
    
    if (data.payment !== undefined && this.data.payment !== data.payment) {
      this.data.payment = data.payment;
      changed = true;
    }
    
    if (data.email !== undefined && this.data.email !== data.email) {
      this.data.email = data.email;
      changed = true;
    }
    
    if (data.phone !== undefined && this.data.phone !== data.phone) {
      this.data.phone = data.phone;
      changed = true;
    }
    
    if (data.address !== undefined && this.data.address !== data.address) {
      this.data.address = data.address;
      changed = true;
    }
    
    if (changed) {
      this.events.emit('customer:changed', { data: this.data });
    }
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
  validate(): TBuyerErrors { 
    const errors: TBuyerErrors = {}; 

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
    
    this.events.emit('customer:changed', { data: this.data });
  } 
}
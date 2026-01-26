import { IProduct } from '../../types';

/**
 * Класс для хранения корзины товаров
 * Ответственность: хранение и управление товарами в корзине
 */
export class Basket {
  private items: IProduct[] = [];

  /**
   * Конструктор класса
   * @param initialItems - начальный массив товаров в корзине (опционально)
   */
  constructor(initialItems: IProduct[] = []) {
    this.items = initialItems;
  }

  /**
   * Возвращает массив товаров в корзине
   * @returns массив товаров
   */
  getItems(): IProduct[] {
    return this.items;
  }

  /**
   * Добавляет товар в корзину
   * @param item - товар для добавления
   * @returns true если товар добавлен, false если уже был в корзине
   */
  addItem(item: IProduct): boolean {
    if (this.contains(item.id)) {
      return false;
    }
    this.items.push(item);
    return true;
  }

  /**
   * Удаляет товар из корзины по ID
   * @param id - ID товара
   * @returns true если товар удалён, false если не найден
   */
  removeItem(id: string): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Проверяет, находится ли товар в корзине
   * @param id - ID товара
   * @returns true если товар в корзине, false если нет
   */
  contains(id: string): boolean {
    return this.items.some(item => item.id === id);
  }

  /**
   * Очищает корзину
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Возвращает общую стоимость товаров в корзине
   * @returns общая стоимость (0 если корзина пуста или у товаров нет цены)
   */
  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  /**
   * Возвращает количество товаров в корзине
   * @returns количество товаров
   */
  getItemsCount(): number {
    return this.items.length;
  }

  /**
   * Проверяет, пуста ли корзина
   * @returns true если корзина пуста, false если нет
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Возвращает массив ID товаров в корзине
   * @returns массив ID товаров
   */
  getItemIds(): string[] {
    return this.items.map(item => item.id);
  }
}
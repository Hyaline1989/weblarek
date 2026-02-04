import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

/**
 * Класс для хранения каталога товаров
 * Ответственность: хранение данных о товарах и управление выбранным товаром для детального просмотра
 */
export class ProductList {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;
  private events: EventEmitter;

  /**
   * Конструктор класса
   * @param events - брокер событий
   * @param initialItems - начальный массив товаров (опционально)
   */
  constructor(events: EventEmitter, initialItems: IProduct[] = []) {
    this.events = events;
    this.items = initialItems;
  }

  /**
   * Сохраняет массив товаров
   * @param items - массив товаров для сохранения
   */
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('items:changed', { items: this.items });
  }

  /**
   * Возвращает массив всех товаров
   * @returns массив товаров
   */
  getItems(): IProduct[] {
    return this.items;
  }

  /**
   * Находит товар по его ID
   * @param id - ID товара
   * @returns найденный товар или undefined
   */
  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  /**
   * Сохраняет товар для детального просмотра
   * @param item - товар для просмотра
   */
  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
    this.events.emit('product:select', { item: this.selectedItem });
  }

  /**
   * Сохраняет товар для детального просмотра по ID
   * @param id - ID товара
   * @returns true если товар найден и сохранён, false если нет
   */
  setSelectedItemById(id: string): boolean {
    const item = this.getItemById(id);
    if (item) {
      this.setSelectedItem(item);
      return true;
    }
    return false;
  }

  /**
   * Возвращает товар для детального просмотра
   * @returns выбранный товар или null
   */
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }

  /**
   * Очищает выбранный товар
   */
  clearSelectedItem(): void {
    this.selectedItem = null;
    this.events.emit('product:deselect');
  }

  /**
   * Проверяет, доступен ли товар для покупки
   * @param item - товар для проверки
   * @returns true если товар доступен (имеет цену), false если нет
   */
  isAvailable(item: IProduct): boolean {
    return item.price !== null;
  }
}
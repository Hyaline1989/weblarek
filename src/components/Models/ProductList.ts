import { IProduct } from '../../types';

/**
 * Класс для хранения каталога товаров
 * Ответственность: хранение данных о товарах и управление выбранным товаром для детального просмотра
 */
export class ProductList {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  /**
   * Конструктор класса
   * @param initialItems - начальный массив товаров (опционально)
   */
  constructor(initialItems: IProduct[] = []) {
    this.items = initialItems;
  }

  /**
   * Сохраняет массив товаров
   * @param items - массив товаров для сохранения
   */
  setItems(items: IProduct[]): void {
    this.items = items;
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
  }

  /**
   * Сохраняет товар для детального просмотра по ID
   * @param id - ID товара
   * @returns true если товар найден и сохранён, false если нет
   */
  setSelectedItemById(id: string): boolean {
    const item = this.getItemById(id);
    if (item) {
      this.selectedItem = item;
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
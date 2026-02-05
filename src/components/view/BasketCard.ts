import { Card } from './Card';
import { IProduct } from '../../types';

/**
 * Интерфейс для данных карточки корзины
 */
interface IBasketCardData {
  item: IProduct;
  index: number;
}

/**
 * Карточка товара в корзине
 */
export class BasketCard extends Card<IBasketCardData> {
  private onDeleteClick: () => void;
  private _index: HTMLElement;
  private _deleteButton: HTMLButtonElement;
  private _productId: string;

  constructor(container: HTMLElement, onDeleteClick: () => void) {
    super(container);
    this.onDeleteClick = onDeleteClick;
    
    this._index = this.container.querySelector('.basket__item-index');
    this._deleteButton = this.container.querySelector('.basket__item-delete');
    
    // Обработчик удаления товара через колбэк
    this._deleteButton.addEventListener('click', () => {
      this.onDeleteClick();
    });
  }

  /**
   * Устанавливает индекс товара
   */
  set index(value: number) {
    if (this._index) {
      this._index.textContent = String(value);
    }
  }

  render(data: IBasketCardData): HTMLElement {
    this._productId = data.item.id; // Сохраняем ID в поле класса
    this.index = data.index;
    
    // Используем сеттеры из базового класса Card
    this.title = data.item.title;
    this.price = data.item.price || 0;
    
    return this.container;
  }
}
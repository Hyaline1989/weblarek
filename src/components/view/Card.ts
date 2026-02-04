import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

/**
 * Базовый класс для карточек товаров
 */
export abstract class Card<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    
    // Находим элементы в контейнере
    this._title = this.container.querySelector('.card__title');
    this._image = this.container.querySelector('.card__image');
    this._price = this.container.querySelector('.card__price');
    this._category = this.container.querySelector('.card__category');
  }

  /**
   * Устанавливает категорию товара
   */
  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      
      // Удаляем все существующие классы категорий
      this._category.classList.remove(...Object.values(categoryMap));
      
      // Добавляем соответствующий класс из categoryMap
      const categoryClass = categoryMap[value as keyof typeof categoryMap];
      if (categoryClass) {
        this._category.classList.add(categoryClass);
      }
    }
  }

  /**
   * Устанавливает заголовок товара
   */
  set title(value: string) {
    if (this._title) {
      this._title.textContent = value;
    }
  }

  /**
   * Устанавливает изображение товара
   */
  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, CDN_URL + value, this._title?.textContent || '');
    }
  }

  /**
   * Устанавливает цену товара
   */
  set price(value: number | null) {
    if (this._price) {
      this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
    }
  }
}
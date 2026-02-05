import { Card } from './Card';
import { IProduct } from '../../types';

/**
 * Интерфейс для данных карточки предпросмотра
 */
interface IPreviewCardData extends IProduct {
  inBasket: boolean;
}

/**
 * Карточка товара в модальном окне предпросмотра
 */
export class PreviewCard extends Card<IPreviewCardData> {
  private onButtonClick: () => void;
  private _description: HTMLElement;
  private _button: HTMLButtonElement;
  private _productId: string;

  constructor(container: HTMLElement, onButtonClick: () => void) {
    super(container);
    this.onButtonClick = onButtonClick;
    
    this._description = this.container.querySelector('.card__text');
    this._button = this.container.querySelector('.card__button');
    
    // Обработчик нажатия на кнопку через колбэк
    this._button.addEventListener('click', () => {
      this.onButtonClick();
    });
  }

  /**
   * Устанавливает описание товара
   */
  set description(value: string) {
    if (this._description) {
      this._description.textContent = value;
    }
  }

  /**
   * Устанавливает состояние кнопки (добавить/удалить)
   */
  set buttonState(value: 'add' | 'remove' | 'unavailable') {
    if (this._button) {
      if (value === 'add') {
        this._button.textContent = 'В корзину';
        this._button.disabled = false;
      } else if (value === 'remove') {
        this._button.textContent = 'Удалить из корзины';
        this._button.disabled = false;
      } else {
        this._button.textContent = 'Недоступно';
        this._button.disabled = true;
      }
    }
  }

  render(data: IPreviewCardData): HTMLElement {
    super.render(data);
    
    this._productId = data.id; // Сохраняем ID в поле класса
    this.title = data.title;
    this.description = data.description;
    this.image = data.image;
    this.category = data.category;
    this.price = data.price;
    
    // Устанавливаем состояние кнопки
    if (data.price === null) {
      this.buttonState = 'unavailable';
    } else {
      this.buttonState = data.inBasket ? 'remove' : 'add';
    }
    
    return this.container;
  }
}
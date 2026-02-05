import { Card } from './Card';
import { IProduct } from '../../types';

/**
 * Карточка товара в каталоге
 */
export class CatalogCard extends Card<IProduct> {
  private onClick: () => void;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    this.onClick = onClick;
    
    // Устанавливаем обработчик клика через колбэк
    this.container.addEventListener('click', (event: MouseEvent) => {
      // Предотвращаем клик на заблокированных карточках
      if (!this.container.classList.contains('card_disabled')) {
        this.onClick();
      }
    });
  }

  render(data: IProduct): HTMLElement {
    super.render(data);
    
    // Устанавливаем свойства через сеттеры из базового класса
    this.title = data.title;
    this.image = data.image;
    this.category = data.category;
    this.price = data.price;
    
    // Блокируем кнопку если товар недоступен
    if (data.price === null) {
      this.container.classList.add('card_disabled');
    } else {
      this.container.classList.remove('card_disabled');
    }
    
    return this.container;
  }
}
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

/**
 * Интерфейс для данных модального окна
 */
interface IModalData {
  content: HTMLElement;
}

/**
 * Компонент модального окна
 */
export class Modal extends Component<IModalData> {
  private events: EventEmitter;
  private _closeButton: HTMLButtonElement;
  private _content: HTMLElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;
    
    this._closeButton = this.container.querySelector('.modal__close');
    this._content = this.container.querySelector('.modal__content');
    
    // Обработчики закрытия
    this._closeButton.addEventListener('click', () => this.close());
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
    
    // Запрещаем скролл при открытом модальном окне
    this.container.addEventListener('wheel', (event) => {
      if (this.container.classList.contains('modal_active')) {
        event.preventDefault();
      }
    }, { passive: false });
  }

  /**
   * Устанавливает содержимое модального окна
   */
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  /**
   * Открывает модальное окно
   */
  open(): void {
    this.container.classList.add('modal_active');
    document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    this.events.emit('modal:open');
  }

  /**
   * Закрывает модальное окно
   */
  close(): void {
    this.container.classList.remove('modal_active');
    document.body.style.overflow = ''; // Восстанавливаем скролл
    this._content.innerHTML = '';
    this.events.emit('modal:close');
  }

  render(data: IModalData): HTMLElement {
    this.content = data.content;
    return this.container;
  }
}
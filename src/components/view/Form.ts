import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

/**
 * Базовый класс для форм
 */
export abstract class Form<T> extends Component<T> {
  protected events: EventEmitter;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container);
    this.events = events;
    
    this._submitButton = this.container.querySelector('button[type="submit"]');
    this._errors = this.container.querySelector('.form__errors');
    
    // Обработчик отправки формы
    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit(`${this.container.name}:submit`, this.container);
    });
  }

  /**
   * Устанавливает ошибки валидации
   */
  set errors(value: string) {
    if (this._errors) {
      this._errors.textContent = value;
    }
  }

  /**
   * Устанавливает состояние кнопки отправки
   */
  set valid(value: boolean) {
    if (this._submitButton) {
      this._submitButton.disabled = !value;
    }
  }

  /**
   * Очищает форму
   */
  abstract clear(): void;
}
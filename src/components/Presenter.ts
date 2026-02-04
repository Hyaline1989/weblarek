import { EventEmitter } from './base/Events';
import { ProductList } from './Models/ProductList';
import { Basket } from './Models/Basket';
import { Customer } from './Models/Customer';
import { ShopApi } from './Api/ShopApi';
import { Gallery } from './View/Gallery';
import { Modal } from './View/Modal';
import { Header } from './View/Header';
import { CatalogCard } from './View/CatalogCard';
import { PreviewCard } from './View/PreviewCard';
import { BasketCard } from './View/BasketCard';
import { BasketView } from './View/BasketView';
import { OrderForm } from './View/OrderForm';
import { ContactsForm } from './View/ContactsForm';
import { SuccessView } from './View/SuccessView';
import { IProduct, IBuyer, IOrderData } from '../types';

/**
 * Презентер - основной класс, управляющий логикой приложения
 * Связывает Model и View, обрабатывает события
 */
export class Presenter {
  private events: EventEmitter;
  private productList: ProductList;
  private basket: Basket;
  private customer: Customer;
  private shopApi: ShopApi;

  // View компоненты
  private gallery: Gallery;
  private modal: Modal;
  private header: Header;
  private basketView: BasketView;
  private orderForm: OrderForm;
  private contactsForm: ContactsForm;
  private successView: SuccessView;

  // Шаблоны
  private catalogCardTemplate: HTMLTemplateElement;
  private previewCardTemplate: HTMLTemplateElement;
  private basketCardTemplate: HTMLTemplateElement;
  private basketTemplate: HTMLTemplateElement;
  private orderTemplate: HTMLTemplateElement;
  private contactsTemplate: HTMLTemplateElement;
  private successTemplate: HTMLTemplateElement;

  constructor(
    events: EventEmitter,
    productList: ProductList,
    basket: Basket,
    customer: Customer,
    shopApi: ShopApi
  ) {
    this.events = events;
    this.productList = productList;
    this.basket = basket;
    this.customer = customer;
    this.shopApi = shopApi;

    this.initTemplates();
    this.initViews();
    this.initEventHandlers();
  }

  /**
   * Инициализация шаблонов из HTML
   */
  private initTemplates() {
    this.catalogCardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
    this.previewCardTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
    this.basketCardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
    this.basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
    this.orderTemplate = document.getElementById('order') as HTMLTemplateElement;
    this.contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    this.successTemplate = document.getElementById('success') as HTMLTemplateElement;
  }

  /**
   * Инициализация View компонентов
   */
  private initViews() {
    // Основные компоненты
    const galleryContainer = document.querySelector('.gallery') as HTMLElement;
    const modalContainer = document.getElementById('modal-container') as HTMLElement;
    const headerContainer = document.querySelector('.header') as HTMLElement;

    this.gallery = new Gallery(galleryContainer);
    this.modal = new Modal(modalContainer, this.events);
    this.header = new Header(headerContainer, this.events);

    // Обновляем счетчик корзины
    this.updateBasketCounter();
  }

  /**
   * Инициализация обработчиков событий
   */
  private initEventHandlers() {
    // События от моделей
    this.events.on('items:changed', () => this.updateCatalog());
    this.events.on('basket:changed', () => this.updateBasket());
    this.events.on('product:select', () => this.openProductModal());

    // События от View
    this.events.on('card:select', (element: HTMLElement) => this.handleCardSelect(element));
    this.events.on('card:action', (data: { id: string }) => this.handleCardAction(data.id));
    this.events.on('basket:open', () => this.openBasketModal());
    this.events.on('basket:remove', (data: { id: string }) => this.handleBasketRemove(data.id));
    this.events.on('order:open', () => this.openOrderModal());
    this.events.on('order:submit', () => this.handleOrderSubmit());
    this.events.on('order.payment:change', (data: { payment: string }) => this.handlePaymentChange(data.payment));
    this.events.on('order.address:change', (data: { address: string }) => this.handleAddressChange(data.address));
    this.events.on('contacts:submit', () => this.handleContactsSubmit());
    this.events.on('contacts.email:change', (data: { email: string }) => this.handleEmailChange(data.email));
    this.events.on('contacts.phone:change', (data: { phone: string }) => this.handlePhoneChange(data.phone));
    this.events.on('success:close', () => this.handleSuccessClose());
    this.events.on('modal:close', () => this.handleModalClose());
  }

  /**
   * Обновление каталога товаров
   */
  private updateCatalog() {
    const products = this.productList.getItems();
    const cardElements: HTMLElement[] = [];

    products.forEach(product => {
      const cardElement = this.catalogCardTemplate.content.cloneNode(true) as HTMLElement;
      const card = new CatalogCard(cardElement.querySelector('.card'), this.events);
      card.render(product);
      cardElements.push(card.render(product));
    });

    this.gallery.render({ items: cardElements });
  }

  /**
   * Обновление счетчика корзины в хедере
   */
  private updateBasketCounter() {
    this.header.render({ counter: this.basket.getItemsCount() });
  }

  /**
   * Обновление отображения корзины
   */
  private updateBasket() {
    this.updateBasketCounter();
    
    if (this.basketView) {
      const basketItems = this.basket.getItems();
      const basketCardElements: HTMLElement[] = [];
      
      basketItems.forEach((item, index) => {
        const cardElement = this.basketCardTemplate.content.cloneNode(true) as HTMLElement;
        const card = new BasketCard(cardElement.querySelector('.basket__item'), this.events);
        card.render({ item, index: index + 1 });
        basketCardElements.push(card.render({ item, index: index + 1 }));
      });
      
      this.basketView.render({
        items: basketCardElements,
        total: this.basket.getTotalPrice()
      });
    }
  }

  /**
   * Обработка выбора карточки товара
   */
  private handleCardSelect(element: HTMLElement) {
    const productId = element.dataset.id;
    this.productList.setSelectedItemById(productId);
  }

  /**
   * Открытие модального окна с деталями товара
   */
  private openProductModal() {
    const product = this.productList.getSelectedItem();
    if (!product) return;

    const cardElement = this.previewCardTemplate.content.cloneNode(true) as HTMLElement;
    const card = new PreviewCard(cardElement.querySelector('.card'), this.events);
    
    const inBasket = this.basket.contains(product.id);
    card.render({ ...product, inBasket });
    
    this.modal.render({ content: card.render({ ...product, inBasket }) });
    this.modal.open();
  }

  /**
   * Обработка действия с карточкой (добавить/удалить)
   */
  private handleCardAction(productId: string) {
    const product = this.productList.getItemById(productId);
    if (!product) return;

    if (this.basket.contains(productId)) {
      this.basket.removeItem(productId);
    } else {
      this.basket.addItem(product);
    }
    
    // Закрываем модальное окно после действия
    setTimeout(() => this.modal.close(), 300);
  }

  /**
   * Открытие модального окна корзины
   */
  private openBasketModal() {
    const basketElement = this.basketTemplate.content.cloneNode(true) as HTMLElement;
    this.basketView = new BasketView(basketElement.querySelector('.basket'), this.events);
    
    const basketItems = this.basket.getItems();
    const basketCardElements: HTMLElement[] = [];
    
    basketItems.forEach((item, index) => {
      const cardElement = this.basketCardTemplate.content.cloneNode(true) as HTMLElement;
      const card = new BasketCard(cardElement.querySelector('.basket__item'), this.events);
      card.render({ item, index: index + 1 });
      basketCardElements.push(card.render({ item, index: index + 1 }));
    });
    
    this.basketView.render({
      items: basketCardElements,
      total: this.basket.getTotalPrice()
    });
    
    this.modal.render({ content: this.basketView.render({
      items: basketCardElements,
      total: this.basket.getTotalPrice()
    }) });
    this.modal.open();
  }

  /**
   * Обработка удаления товара из корзины
   */
  private handleBasketRemove(productId: string) {
    this.basket.removeItem(productId);
  }

  /**
   * Открытие модального окна оформления заказа
   */
  private openOrderModal() {
    const orderElement = this.orderTemplate.content.cloneNode(true) as HTMLElement;
    this.orderForm = new OrderForm(orderElement.querySelector('.form'), this.events);
    
    const customerData = this.customer.getData();
    this.orderForm.render({
      payment: customerData.payment,
      address: customerData.address,
      valid: false,
      errors: ''
    });
    
    this.modal.render({ content: this.orderForm.render({
      payment: customerData.payment,
      address: customerData.address,
      valid: false,
      errors: ''
    }) });
    this.modal.open();
  }

  /**
   * Обработка изменения способа оплаты
   */
  private handlePaymentChange(payment: string) {
    this.customer.updateData({ payment });
  }

  /**
   * Обработка изменения адреса
   */
  private handleAddressChange(address: string) {
    this.customer.updateData({ address });
  }

  /**
   * Обработка отправки формы заказа
   */
  private handleOrderSubmit() {
    const errors = this.customer.validate();
    
    if (Object.keys(errors).length === 0) {
      this.openContactsModal();
    } else {
      // Показываем ошибки валидации
      const errorMessages = Object.values(errors).join(', ');
      this.orderForm.render({ errors: errorMessages, valid: false });
    }
  }

  /**
   * Открытие модального окна с контактами
   */
  private openContactsModal() {
    const contactsElement = this.contactsTemplate.content.cloneNode(true) as HTMLElement;
    this.contactsForm = new ContactsForm(contactsElement.querySelector('.form'), this.events);
    
    const customerData = this.customer.getData();
    this.contactsForm.render({
      email: customerData.email,
      phone: customerData.phone,
      valid: false,
      errors: ''
    });
    
    this.modal.render({ content: this.contactsForm.render({
      email: customerData.email,
      phone: customerData.phone,
      valid: false,
      errors: ''
    }) });
    this.modal.open();
  }

  /**
   * Обработка изменения email
   */
  private handleEmailChange(email: string) {
    this.customer.updateData({ email });
  }

  /**
   * Обработка изменения телефона
   */
  private handlePhoneChange(phone: string) {
    this.customer.updateData({ phone });
  }

  /**
   * Обработка отправки формы контактов
   */
  private async handleContactsSubmit() {
    const errors = this.customer.validate();
    
    if (Object.keys(errors).length === 0) {
      try {
        // Формируем данные для отправки
        const orderData: IOrderData = {
          ...this.customer.getData(),
          total: this.basket.getTotalPrice(),
          items: this.basket.getItemIds()
        };

        // Отправляем заказ на сервер
        const result = await this.shopApi.sendOrder(orderData);
        
        // Показываем окно успеха
        this.showSuccessModal(result.total);
        
        // Очищаем корзину и данные покупателя
        this.basket.clear();
        this.customer.clear();
        
      } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        this.contactsForm.render({ errors: 'Ошибка при оформлении заказа', valid: false });
      }
    } else {
      const errorMessages = Object.values(errors).join(', ');
      this.contactsForm.render({ errors: errorMessages, valid: false });
    }
  }

  /**
   * Показ окна успешного оформления заказа
   */
  private showSuccessModal(total: number) {
    const successElement = this.successTemplate.content.cloneNode(true) as HTMLElement;
    this.successView = new SuccessView(successElement.querySelector('.order-success'), this.events);
    
    this.successView.render({ total });
    this.modal.render({ content: this.successView.render({ total }) });
  }

  /**
   * Обработка закрытия окна успеха
   */
  private handleSuccessClose() {
    this.modal.close();
  }

  /**
   * Обработка закрытия модального окна
   */
  private handleModalClose() {
    // Очищаем выбранный товар при закрытии модального окна
    this.productList.clearSelectedItem();
  }

  /**
   * Запуск приложения
   */
  async start() {
    try {
      console.log('Загрузка товаров с сервера...');
      const productsResponse = await this.shopApi.getProducts();
      this.productList.setItems(productsResponse.items);
      console.log('Приложение запущено');
    } catch (error) {
      console.error('Ошибка при запуске приложения:', error);
    }
  }
}
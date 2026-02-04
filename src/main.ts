import './scss/styles.scss';
import { ProductList } from './components/Models/ProductList';
import { Basket } from './components/Models/Basket';
import { Customer } from './components/Models/Customer';
import { ShopApi } from './components/Api/ShopApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Presenter } from './components/Presenter';

/**
 * Точка входа в приложение
 */
async function main() {
  console.log('Инициализация приложения...');

  try {
    // Создаём экземпляры классов
    const events = new EventEmitter();
    const apiInstance = new Api(API_URL);
    const shopApi = new ShopApi(apiInstance);
    const productList = new ProductList(events);
    const basket = new Basket(events);
    const customer = new Customer(events);

    // Создаем презентер
    const presenter = new Presenter(events, productList, basket, customer, shopApi);

    // Запускаем приложение
    await presenter.start();

    // Экспортируем для отладки в dev-режиме
    if (import.meta.env.DEV) {
      (window as any).app = {
        presenter,
        productList,
        basket,
        customer,
        events
      };
    }

    console.log('Приложение успешно инициализировано');
  } catch (error) {
    console.error('Ошибка при инициализации приложения:', error);
  }
}

// Запускаем приложение
main();
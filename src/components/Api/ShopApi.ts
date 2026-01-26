import { IApi } from '../../types';
import { IProductsResponse, IOrderData, IOrderResponse } from '../../types';

/**
 * Класс для работы с API магазина
 * Ответственность: получение товаров с сервера и отправка заказов
 */
export class ShopApi {
  private api: IApi;

  /**
   * Конструктор класса
   * @param api - экземпляр класса, реализующего интерфейс IApi
   */
  constructor(api: IApi) {
    this.api = api;
  }

  /**
   * Получает список товаров с сервера
   * @returns промис с ответом от сервера
   */
  async getProducts(): Promise<IProductsResponse> {
    return await this.api.get<IProductsResponse>('/product');
  }

  /**
   * Отправляет заказ на сервер
   * @param orderData - данные заказа
   * @returns промис с ответом от сервера
   */
  async sendOrder(orderData: IOrderData): Promise<IOrderResponse> {
    return await this.api.post<IOrderResponse>('/order', orderData);
  }
}
import { Api } from '../base/Api';
import { IProductsResponse, IOrderData, IOrderResponse } from '../../types';

/**
 * Класс для работы с API магазина
 * Ответственность: получение товаров с сервера и отправка заказов
 */
export class ShopApi {
  private api: Api;

  /**
   * Конструктор класса
   * @param baseUrl - базовый URL API
   * @param options - опции для запросов (опционально)
   */
  constructor(baseUrl: string, options: RequestInit = {}) {
    this.api = new Api(baseUrl, options);
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
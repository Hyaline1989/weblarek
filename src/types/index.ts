export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Способ оплаты
export type TPayment = 'card' | 'cash';

// Товар
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Покупатель
export interface IBuyer {
  payment: TPayment | string; // string для пустого значения
  email: string;
  phone: string;
  address: string;
}

// Ошибки валидации покупателя - используем Record для типизации ключей
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

// Данные для отправки заказа на сервер - расширяем IBuyer
export interface IOrderData extends IBuyer {
  total: number;
  items: string[];
}

// Ответ от сервера с товарами
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

// Ответ от сервера при оформлении заказа
export interface IOrderResponse {
  id: string;
  total: number;
}

// Интерфейс для API
export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
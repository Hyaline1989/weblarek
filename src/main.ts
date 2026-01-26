import './scss/styles.scss';
import { ProductList } from './components/Models/ProductList';
import { Basket } from './components/Models/Basket';
import { Customer } from './components/Models/Customer';
import { ShopApi } from './components/Api/ShopApi';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

/**
 * Точка входа приложения
 * Здесь создаются экземпляры классов и тестируется их работа
 */
async function main() {
  console.log('=== Тестирование моделей данных ===');

  // 1. Тестирование ProductList
  console.log('\n1. Тестирование ProductList:');
  const productList = new ProductList();
  productList.setItems(apiProducts.items);
  
  console.log('Все товары:', productList.getItems());
  console.log('Количество товаров:', productList.getItems().length);
  
  const firstProduct = apiProducts.items[0];
  console.log('Первый товар:', firstProduct);
  
  productList.setSelectedItem(firstProduct);
  console.log('Выбранный товар:', productList.getSelectedItem());
  
  const foundProduct = productList.getItemById(firstProduct.id);
  console.log('Найденный товар по ID:', foundProduct);
  console.log('Товар доступен?', productList.isAvailable(firstProduct));

  // 2. Тестирование Basket
  console.log('\n2. Тестирование Basket:');
  const basket = new Basket();
  
  console.log('Корзина пуста?', basket.isEmpty());
  
  basket.addItem(firstProduct);
  console.log('Добавлен товар в корзину');
  console.log('Товары в корзине:', basket.getItems());
  console.log('Количество товаров:', basket.getItemsCount());
  console.log('Общая стоимость:', basket.getTotalPrice());
  console.log('Содержит товар?', basket.contains(firstProduct.id));
  
  basket.removeItem(firstProduct.id);
  console.log('Товар удалён из корзины');
  console.log('Товары в корзине после удаления:', basket.getItems());
  
  // Добавляем несколько товаров для теста
  apiProducts.items.forEach(item => {
    if (item.price !== null) {
      basket.addItem(item);
    }
  });
  console.log('Добавлены все доступные товары');
  console.log('Товары в корзине:', basket.getItems());
  console.log('Общая стоимость всех товаров:', basket.getTotalPrice());
  console.log('ID товаров в корзине:', basket.getItemIds());

  // 3. Тестирование Customer
  console.log('\n3. Тестирование Customer:');
  const customer = new Customer();
  
  console.log('Данные покупателя (начальные):', customer.getData());
  console.log('Валидны ли данные?', !customer.hasErrors());
  console.log('Ошибки валидации:', customer.validate());
  
  customer.setPayment('card');
  customer.setEmail('test@example.com');
  customer.setPhone('+79991234567');
  customer.setAddress('ул. Примерная, д. 1');
  
  console.log('Данные покупателя (после заполнения):', customer.getData());
  console.log('Валидны ли данные?', !customer.hasErrors());
  console.log('Ошибки валидации:', customer.validate());
  console.log('Все поля заполнены?', customer.isComplete());
  
  // Тестирование частичного обновления
  customer.setData({ phone: '+79998765432' });
  console.log('Данные после частичного обновления:', customer.getData());

  // 4. Тестирование ShopApi
  console.log('\n4. Тестирование ShopApi:');
  const shopApi = new ShopApi(API_URL);
  
  try {
    const productsResponse = await shopApi.getProducts();
    console.log('Получены товары с сервера:', productsResponse);
    
    // Сохраняем товары в ProductList
    productList.setItems(productsResponse.items);
    console.log('Товары сохранены в ProductList, количество:', productList.getItems().length);
    
    // Тестирование заказа (комментируем, чтобы не отправлять тестовые заказы)
    /*
    const orderData: IOrderData = {
      payment: 'card',
      email: 'test@example.com',
      phone: '+79991234567',
      address: 'ул. Примерная, д. 1',
      total: basket.getTotalPrice(),
      items: basket.getItemIds()
    };
    
    const orderResponse = await shopApi.sendOrder(orderData);
    console.log('Заказ отправлен, ответ сервера:', orderResponse);
    */
    
  } catch (error) {
    console.error('Ошибка при работе с API:', error);
  }

  console.log('\n=== Тестирование завершено ===');
}

// Запуск приложения
main().catch(console.error);
import './scss/styles.scss';
import { ProductList } from './components/Models/ProductList';
import { Basket } from './components/Models/Basket';
import { Customer } from './components/Models/Customer';
import { ShopApi } from './components/Api/ShopApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

/**
 * Тестирование моделей данных
 */
function testModels() {
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
  
  // Тестирование заполнения части данных
  console.log('\nТестирование частичного заполнения:');
  customer.setPayment('card');
  customer.setEmail('test@example.com');
  console.log('Данные после заполнения части полей:', customer.getData());
  console.log('Ошибки валидации (частичное заполнение):', customer.validate());
  console.log('Есть ошибки?', customer.hasErrors());
  
  // Заполняем оставшиеся поля
  customer.setPhone('+79991234567');
  customer.setAddress('ул. Примерная, д. 1');
  
  console.log('\nДанные покупателя (после полного заполнения):', customer.getData());
  console.log('Валидны ли данные?', !customer.hasErrors());
  console.log('Ошибки валидации:', customer.validate());
  
  // Тестирование частичного обновления
  customer.updateData({ phone: '+79998765432' });
  console.log('Данные после частичного обновления:', customer.getData());

  console.log('\n=== Тестирование моделей завершено ===');

  return { productList, basket, customer };
}

/**
 * Тестирование API (отдельная функция для асинхронных операций)
 */
async function testApi() {
  console.log('\n=== Тестирование API ===');
  
  try {
    // Создаём экземпляр API
    const apiInstance = new Api(API_URL);
    const shopApi = new ShopApi(apiInstance);
    
    const productsResponse = await shopApi.getProducts();
    console.log('Получены товары с сервера:', productsResponse);
    
    return productsResponse;
  } catch (error) {
    console.error('Ошибка при работе с API:', error);
    throw error; // Пробрасываем ошибку дальше
  }
}

/**
 * Основная функция инициализации приложения
 */
async function initApp() {
  console.log('=== Инициализация приложения ===');
  
  // Тестируем модели (синхронно)
  const models = testModels();
  
  // Тестируем API (асинхронно)
  try {
    const productsResponse = await testApi();
    
    // Сохраняем товары в ProductList
    models.productList.setItems(productsResponse.items);
    console.log('Товары сохранены в ProductList, количество:', models.productList.getItems().length);
    
  } catch (error) {
    console.error('Ошибка при инициализации приложения:', error);
    // В реальном приложении здесь можно показать сообщение пользователю
    // или использовать fallback-данные
    console.log('Используем локальные данные для тестирования');
  }
  
  console.log('\n=== Инициализация завершена ===');
  
  // Возвращаем экземпляры для дальнейшего использования
  return models;
}

// Запуск приложения
initApp();
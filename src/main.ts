import './scss/styles.scss';
import { ProductList } from './components/Models/ProductList';
import { Basket } from './components/Models/Basket';
import { Customer } from './components/Models/Customer';
import { ShopApi } from './components/Api/ShopApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// Создаём экземпляры классов один раз (глобально)
const productList = new ProductList();
const basket = new Basket();
const customer = new Customer();
const apiInstance = new Api(API_URL);
const shopApi = new ShopApi(apiInstance);

console.log('=== Инициализация приложения ===');

// === Тестирование моделей данных ===
console.log('\n=== Тестирование моделей данных ===');

// 1. Тестирование ProductList
console.log('\n1. Тестирование ProductList:');
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
console.log('Данные покупателя (начальные):', customer.getData());

// Используем validate() напрямую (убрали hasErrors())
const initialErrors = customer.validate();
console.log('Ошибки валидации:', initialErrors);
console.log('Валидны ли данные?', Object.keys(initialErrors).length === 0);

// Тестирование заполнения данных
console.log('\nТестирование заполнения данных:');
customer.updateData({ payment: 'card' });
customer.updateData({ email: 'test@example.com' });
console.log('Данные после заполнения части полей:', customer.getData());

const partialErrors = customer.validate();
console.log('Ошибки валидации (частичное заполнение):', partialErrors);
console.log('Есть ошибки?', Object.keys(partialErrors).length > 0);

// Заполняем оставшиеся поля
customer.updateData({ phone: '+79991234567' });
customer.updateData({ address: 'ул. Примерная, д. 1' });

console.log('\nДанные покупателя (после полного заполнения):', customer.getData());

const finalErrors = customer.validate();
console.log('Ошибки валидации:', finalErrors);
console.log('Валидны ли данные?', Object.keys(finalErrors).length === 0);

// Тестирование частичного обновления
customer.updateData({ phone: '+79998765432' });
console.log('Данные после частичного обновления:', customer.getData());

console.log('\n=== Тестирование моделей завершено ===');

/**
 * Асинхронная функция для получения товаров с API
 * Вынесена отдельно, так как это единственная асинхронная операция
 */
async function fetchProductsFromApi() {
  try {
    console.log('\n=== Получение товаров с API ===');
    const productsResponse = await shopApi.getProducts();
    console.log('Получены товары с сервера:', productsResponse);
    
    // Сохраняем товары в ProductList
    productList.setItems(productsResponse.items);
    console.log('Товары сохранены в ProductList, количество:', productList.getItems().length);
    
    return productsResponse;
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    console.log('Используем локальные данные для тестирования');
    // Можно продолжить работу с локальными данными
    throw error; // Пробрасываем ошибку дальше при необходимости
  }
}

// Запускаем асинхронную операцию
fetchProductsFromApi()
  .then(() => {
    console.log('\n=== Инициализация завершена успешно ===');
    
    // Экспортируем экземпляры для дальнейшего использования в других модулях
    // В реальном приложении это может быть нужно для других частей системы
    // Если проект растет, можно вынести это в отдельный модуль управления состоянием
    console.log('Доступные экземпляры:', { productList, basket, customer, shopApi });
  })
  .catch((error) => {
    console.error('=== Инициализация завершена с ошибками ===');
    console.error('Приложение будет работать с локальными данными');
  });
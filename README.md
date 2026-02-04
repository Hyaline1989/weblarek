# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

markdown
## Данные

### Интерфейсы данных

#### IProduct (Товар)
```typescript
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
Описание: Интерфейс описывает структуру товара в каталоге магазина.

IBuyer (Покупатель)
typescript
interface IBuyer {
  payment: TPayment | string;
  email: string;
  phone: string;
  address: string;
}
Описание: Интерфейс описывает данные покупателя, необходимые для оформления заказа. Поле payment может быть строкой для представления пустого значения.

TBuyerErrors (Ошибки валидации покупателя)
typescript
type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;
Описание: Тип для хранения ошибок валидации полей покупателя. Использует Record и keyof для автоматической синхронизации с интерфейсом IBuyer.

IOrderData (Данные заказа)
typescript
interface IOrderData extends IBuyer {
  total: number;
  items: string[];
}
Описание: Интерфейс описывает данные, отправляемые на сервер при оформлении заказа. Расширяет интерфейс IBuyer, избегая дублирования полей.

IProductsResponse (Ответ сервера с товарами)
typescript
interface IProductsResponse {
  total: number;
  items: IProduct[];
}
Описание: Интерфейс описывает ответ сервера при запросе списка товаров.

IOrderResponse (Ответ сервера на заказ)
typescript
interface IOrderResponse {
  id: string;
  total: number;
}
Описание: Интерфейс описывает ответ сервера при успешном оформлении заказа.

TPayment (Способ оплаты)
typescript
type TPayment = 'card' | 'cash';
Описание: Тип для способа оплаты, может принимать значения "card" или "cash".

IApi (Интерфейс API)
typescript
interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
Описание: Абстрактный интерфейс для работы с API, обеспечивающий соблюдение принципа инверсии зависимостей.

Модели данных
Класс ProductList (Каталог товаров)
Назначение: Хранение каталога товаров и управление выбранным товаром для детального просмотра.

Конструктор:

typescript
constructor(events: EventEmitter, initialItems: IProduct[] = [])
events: EventEmitter - экземпляр брокера событий

initialItems: IProduct[] - начальный массив товаров для инициализации каталога (опционально)

Поля:

private items: IProduct[] - массив всех товаров в каталоге

private selectedItem: IProduct | null - товар, выбранный для детального просмотра

private events: EventEmitter - брокер событий

Методы:

setItems(items: IProduct[]): void - сохраняет массив товаров и генерирует событие items:changed

getItems(): IProduct[] - возвращает массив всех товаров

getItemById(id: string): IProduct | undefined - находит товар по ID

setSelectedItem(item: IProduct): void - сохраняет товар для детального просмотра и генерирует событие product:select

setSelectedItemById(id: string): boolean - сохраняет товар для детального просмотра по ID

getSelectedItem(): IProduct | null - возвращает выбранный товар

clearSelectedItem(): void - очищает выбранный товар и генерирует событие product:deselect

isAvailable(item: IProduct): boolean - проверяет доступность товара для покупки

Класс Basket (Корзина)
Назначение: Хранение и управление товарами в корзине покупок.

Конструктор:

typescript
constructor(events: EventEmitter, initialItems: IProduct[] = [])
events: EventEmitter - экземпляр брокера событий

initialItems: IProduct[] - начальный массив товаров в корзине (опционально)

Поля:

private items: IProduct[] - массив товаров в корзине

private events: EventEmitter - брокер событий

Методы:

getItems(): IProduct[] - возвращает массив товаров в корзине

addItem(item: IProduct): boolean - добавляет товар в корзину, генерирует событие basket:changed

removeItem(id: string): boolean - удаляет товар из корзины по ID, генерирует событие basket:changed

contains(id: string): boolean - проверяет наличие товара в корзине

clear(): void - очищает корзину, генерирует событие basket:changed

getTotalPrice(): number - возвращает общую стоимость товаров

getItemsCount(): number - возвращает количество товаров

isEmpty(): boolean - проверяет, пуста ли корзина

getItemIds(): string[] - возвращает массив ID товаров

Класс Customer (Покупатель)
Назначение: Хранение и валидация данных покупателя.

Конструктор:

typescript
constructor(events: EventEmitter, initialData: Partial<IBuyer> = {})
events: EventEmitter - экземпляр брокера событий

initialData: Partial<IBuyer> - начальные данные покупателя (опционально)

Поля:

private data: IBuyer - объект с данными покупателя

private events: EventEmitter - брокер событий

Методы:

updateData(data: Partial<IBuyer>): void - обновляет данные покупателя, генерирует событие customer:changed

getData(): IBuyer - возвращает все данные покупателя

validate(): TBuyerErrors - валидирует данные покупателя, возвращает объект с ошибками

clear(): void - очищает все данные покупателя, генерирует событие customer:changed

Слой представления (View)
Базовые классы
Component<T>
Назначение: Базовый класс для всех компонентов представления.

Конструктор:

typescript
constructor(protected readonly container: HTMLElement)
Методы:

render(data?: Partial<T>): HTMLElement - рендерит компонент с переданными данными

protected setImage(element: HTMLImageElement, src: string, alt?: string) - утилитарный метод для установки изображения

Card<T>
Назначение: Базовый класс для всех карточек товаров.

Конструктор:

typescript
constructor(container: HTMLElement)
Поля:

protected _title: HTMLElement - элемент заголовка

protected _image: HTMLImageElement - элемент изображения

protected _price: HTMLElement - элемент цены

protected _category: HTMLElement - элемент категории

Методы:

Сеттеры для установки данных: category, title, image, price

Form<T>
Назначение: Базовый класс для всех форм.

Конструктор:

typescript
constructor(container: HTMLFormElement, events: EventEmitter)
Поля:

protected events: EventEmitter - брокер событий

protected _submitButton: HTMLButtonElement - кнопка отправки формы

protected _errors: HTMLElement - элемент для отображения ошибок

Методы:

set errors(value: string) - устанавливает ошибки валидации

set valid(value: boolean) - устанавливает состояние кнопки отправки

abstract clear(): void - абстрактный метод для очистки формы

Компоненты представления
CatalogCard (наследуется от Card<IProduct>)
Назначение: Карточка товара в каталоге.
События: card:select - при клике на карточку

PreviewCard (наследуется от Card<IProduct>)
Назначение: Карточка товара в модальном окне предпросмотра.
События: card:action - при нажатии кнопки "В корзину"/"Удалить из корзины"

BasketCard (наследуется от Component<IBasketCardData>)
Назначение: Карточка товара в корзине.
События: basket:remove - при нажатии кнопки удаления

BasketView (наследуется от Component<IBasketData>)
Назначение: Модальное окно корзины.
События: order:open - при нажатии кнопки "Оформить"

OrderForm (наследуется от Form<IOrderFormData>)
Назначение: Форма оформления заказа (шаг 1).
События:

order.payment:change - при изменении способа оплаты

order.address:change - при изменении адреса

order:submit - при отправке формы

ContactsForm (наследуется от Form<IContactsFormData>)
Назначение: Форма контактов (шаг 2).
События:

contacts.email:change - при изменении email

contacts.phone:change - при изменении телефона

contacts:submit - при отправке формы

SuccessView (наследуется от Component<ISuccessData>)
Назначение: Окно успешного оформления заказа.
События: success:close - при закрытии окна

Header (наследуется от Component<IHeaderData>)
Назначение: Хедер с корзиной.
События: basket:open - при клике на иконку корзины

Gallery (наследуется от Component<IGalleryData>)
Назначение: Контейнер для карточек каталога.

Modal (наследуется от Component<IModalData>)
Назначение: Модальное окно.
События: modal:open, modal:close - при открытии/закрытии окна

Слой презентера (Presenter)
Класс Presenter
Назначение: Управление всей логикой приложения, связь между Model и View.

Конструктор:

typescript
constructor(
  events: EventEmitter,
  productList: ProductList,
  basket: Basket,
  customer: Customer,
  shopApi: ShopApi
)
Основные методы:

start(): Promise<void> - запуск приложения

private updateCatalog(): void - обновление каталога товаров

private updateBasket(): void - обновление отображения корзины

private openProductModal(): void - открытие модального окна с товаром

private openBasketModal(): void - открытие модального окна корзины

private openOrderModal(): void - открытие формы оформления заказа

private openContactsModal(): void - открытие формы контактов

private showSuccessModal(total: number): void - показ окна успеха

Обработчики событий:

handleCardSelect(element: HTMLElement) - выбор карточки товара

handleCardAction(productId: string) - действие с товаром (добавить/удалить)

handleBasketRemove(productId: string) - удаление товара из корзины

handleOrderSubmit() - отправка формы заказа

handleContactsSubmit() - отправка формы контактов

handleSuccessClose() - закрытие окна успеха

Событийная модель
События от моделей данных:
items:changed - изменение каталога товаров

product:select - выбор товара для просмотра

product:deselect - снятие выбора товара

basket:changed - изменение содержимого корзины

customer:changed - изменение данных покупателя

События от представлений:
card:select - выбор карточки для просмотра

card:action - нажатие кнопки покупки/удаления товара

basket:open - нажатие кнопки открытия корзины

basket:remove - нажатие кнопки удаления товара из корзины

order:open - нажатие кнопки оформления заказа

order:submit - отправка формы заказа (шаг 1)

order.payment:change - изменение способа оплаты

order.address:change - изменение адреса доставки

contacts:submit - отправка формы контактов (шаг 2)

contacts.email:change - изменение email

contacts.phone:change - изменение телефона

success:close - закрытие окна успешного заказа

modal:open - открытие модального окна

modal:close - закрытие модального окна

Слой коммуникации
Класс ShopApi
Назначение: Обеспечение взаимодействия приложения с сервером через API.

Конструктор:

typescript
constructor(api: IApi)
api - экземпляр класса, реализующего интерфейс IApi

Принцип проектирования: Класс зависит от абстракции (IApi), а не от конкретной реализации, что соответствует принципу инверсии зависимостей (Dependency Inversion Principle) из SOLID.

Поля:

private api: IApi - экземпляр API, реализующий интерфейс IApi

Методы:

async getProducts(): Promise<IProductsResponse> - получает список товаров с сервера

async sendOrder(orderData: IOrderData): Promise<IOrderResponse> - отправляет заказ на сервер

Пример использования:

typescript
// Создание конкретной реализации API
const apiInstance = new Api(API_URL);

// Создание ShopApi с передачей абстракции
const shopApi = new ShopApi(apiInstance);

// Использование
const products = await shopApi.getProducts();
Преимущества подхода:

Легко тестировать ShopApi с mock-объектами

Заменять реализацию API без изменения кода ShopApi

Соблюдать принципы SOLID

Константы и утилиты
Файл src/utils/constants.ts
Содержит константы приложения:

API_URL - базовый URL API сервера

CDN_URL - базовый URL для изображений

categoryMap - соответствие категорий товаров CSS-классам

Файл src/utils/utils.ts
Содержит вспомогательные функции для работы с приложением.

Тестирование функциональности
Приложение проходит все функциональные требования:

Главная страница:
✅ Содержит каталог товаров

✅ При нажатии на карточку товара открывается модальное окно с информацией

✅ При нажатии на иконку корзины открывается корзина

✅ На иконке корзины отображается счётчик количества товаров

Просмотр товара:
✅ Показана детальная информация о товаре

✅ Кнопка «Купить» для товаров не в корзине

✅ Кнопка «Удалить из корзины» для товаров в корзине

✅ Товар добавляется/удаляется из корзины

✅ Модальное окно закрывается после действия

✅ Кнопка «Недоступно» для товаров без цены

Корзина:
✅ Отображается список выбранных товаров

✅ Для каждого товара указана цена и кнопка удаления

✅ Отображается общая стоимость

✅ Кнопка оформления покупки активна только при наличии товаров

✅ При отсутствии товаров отображается «Корзина пуста»

✅ При нажатии «Оформить» открывается форма оформления

Оформление товара:
Первый шаг:
✅ Выбор способа оплаты

✅ Ввод адреса доставки

✅ Сообщения об ошибках при пустых полях

✅ Кнопка «Далее» активна только при корректно заполненных полях

✅ При нажатии «Далее» открывается вторая форма

Второй шаг:
✅ Ввод почты и телефона

✅ Сообщения об ошибках при пустых полях

✅ Кнопка «Оплатить» активна только при корректно заполненных полях

✅ При нажатии отправляются данные на сервер

✅ Показывается сообщение об успешной оплате

✅ Корзина и данные покупателя очищаются

Требования ко всем страницам:
✅ Модальные окна закрываются по клику вне окна

✅ Модальные окна закрываются по клику на крестик

✅ Модальные окна не скролятся
https://github.com/Hyaline1989/weblarek.git
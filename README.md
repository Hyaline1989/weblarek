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

## Данные

### Интерфейсы данных

#### IProduct (Товар)
typescript
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
constructor(initialItems: IProduct[] = [])
initialItems (опционально) - начальный массив товаров для инициализации каталога.

Поля:

private items: IProduct[] - массив всех товаров в каталоге.

private selectedItem: IProduct | null - товар, выбранный для детального просмотра.

Методы:

setItems(items: IProduct[]): void - сохраняет массив товаров.

getItems(): IProduct[] - возвращает массив всех товаров.

getItemById(id: string): IProduct | undefined - находит товар по ID.

setSelectedItem(item: IProduct): void - сохраняет товар для детального просмотра.

setSelectedItemById(id: string): boolean - сохраняет товар для детального просмотра по ID.

getSelectedItem(): IProduct | null - возвращает выбранный товар.

clearSelectedItem(): void - очищает выбранный товар.

isAvailable(item: IProduct): boolean - проверяет доступность товара для покупки.

Класс Basket (Корзина)
Назначение: Хранение и управление товарами в корзине покупок.

Конструктор:

typescript
constructor(initialItems: IProduct[] = [])
initialItems (опционально) - начальный массив товаров в

напиши только часть, которую надо заменить
Вот только та часть README.md, которую нужно заменить (от раздела "Данные" и до конца):

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
constructor(initialItems: IProduct[] = [])
initialItems (опционально) - начальный массив товаров для инициализации каталога.

Поля:

private items: IProduct[] - массив всех товаров в каталоге.

private selectedItem: IProduct | null - товар, выбранный для детального просмотра.

Методы:

setItems(items: IProduct[]): void - сохраняет массив товаров.

getItems(): IProduct[] - возвращает массив всех товаров.

getItemById(id: string): IProduct | undefined - находит товар по ID.

setSelectedItem(item: IProduct): void - сохраняет товар для детального просмотра.

setSelectedItemById(id: string): boolean - сохраняет товар для детального просмотра по ID.

getSelectedItem(): IProduct | null - возвращает выбранный товар.

clearSelectedItem(): void - очищает выбранный товар.

isAvailable(item: IProduct): boolean - проверяет доступность товара для покупки.

Класс Basket (Корзина)
Назначение: Хранение и управление товарами в корзине покупок.

Конструктор:

typescript
constructor(initialItems: IProduct[] = [])
initialItems (опционально) - начальный массив товаров в корзине.

Поля:

private items: IProduct[] - массив товаров в корзине.

Методы:

getItems(): IProduct[] - возвращает массив товаров в корзине.

addItem(item: IProduct): boolean - добавляет товар в корзину.

removeItem(id: string): boolean - удаляет товар из корзины по ID.

contains(id: string): boolean - проверяет наличие товара в корзине.

clear(): void - очищает корзину.

getTotalPrice(): number - возвращает общую стоимость товаров.

getItemsCount(): number - возвращает количество товаров.

isEmpty(): boolean - проверяет, пуста ли корзина.

getItemIds(): string[] - возвращает массив ID товаров.

Класс Customer (Покупатель)
Назначение: Хранение и валидация данных покупателя.

Конструктор:

typescript
constructor(initialData: Partial<IBuyer> = {})
initialData (опционально) - начальные данные покупателя.

Поля:

private data: IBuyer - объект с данными покупателя. Все поля гарантированно инициализированы (пустыми строками при отсутствии значений).

Методы:

setPayment(payment: TPayment): void - устанавливает способ оплаты.

setEmail(email: string): void - устанавливает email.

setPhone(phone: string): void - устанавливает телефон.

setAddress(address: string): void - устанавливает адрес.

updateData(data: Partial<IBuyer>): void - обновляет данные покупателя с проверкой на undefined.

getData(): IBuyer - возвращает все данные покупателя.

validate(): TBuyerErrors - валидирует данные покупателя, возвращает объект с ошибками.

hasErrors(): boolean - проверяет наличие ошибок валидации.

clear(): void - очищает все данные покупателя, устанавливая пустые строки.

isFieldFilled(field: keyof IBuyer): boolean - проверяет заполненность конкретного поля.

Слой коммуникации
Класс ShopApi
Назначение: Обеспечение взаимодействия приложения с сервером через API.

Конструктор:

typescript
constructor(api: IApi)
api - экземпляр класса, реализующего интерфейс IApi.

Принцип проектирования: Класс зависит от абстракции (IApi), а не от конкретной реализации, что соответствует принципу инверсии зависимостей (Dependency Inversion Principle) из SOLID. Это обеспечивает гибкость, тестируемость и легкую замену реализации API.

Поля:

private api: IApi - экземпляр API, реализующий интерфейс IApi.

Методы:

async getProducts(): Promise<IProductsResponse> - получает список товаров с сервера.

async sendOrder(orderData: IOrderData): Promise<IOrderResponse> - отправляет заказ на сервер.

Пример использования:

typescript
// Создание конкретной реализации API
const apiInstance = new Api(API_URL);

// Создание ShopApi с передачей абстракции
const shopApi = new ShopApi(apiInstance);

// Использование
const products = await shopApi.getProducts();
Такой подход позволяет:

Легко тестировать ShopApi с mock-объектами

Заменять реализацию API без изменения кода ShopApi

Соблюдать принципы SOLID
https://github.com/Hyaline1989/weblarek.git
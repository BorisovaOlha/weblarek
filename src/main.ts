import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Buyer } from './components/Models/Buyer';
import { Basket } from './components/Models/Basket';
import { Products } from './components/Models/Products';
import { IBuyer } from './types';
import { Api, WebLarekApi } from './components/base/Api';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { EventEmitter, IEvents } from './components/base/Events';
import { CardCatalog } from './components/views/CardCatalog';

const productsModel = new Products();
productsModel.setItems(apiProducts.items);
productsModel.setItem(apiProducts.items[0]);

console.log("Массив товаров из каталога: ", productsModel.getItems());
console.log("Товар, выбранный для подробного отображения: ", productsModel.getItem());
console.log("Товар, найденный по id: ", productsModel.getItemById(apiProducts.items[1].id));


const buyer1: IBuyer = {
  payment: "card",
  email: "ivan@gnail.ru",
  phone: "78479291234",
  address: "ул. Ивана"
};

const buyerModel = new Buyer();
buyerModel.setData("email", buyer1.email);
buyerModel.setData("phone", buyer1.phone);

console.log("Данные покупателя: ", buyerModel.getData());
console.log("Результат проверки данных покупателя: ", buyerModel.checkData());

buyerModel.emptyData();
console.log("Данные покупателя: ", buyerModel.getData());


const basketModel = new Basket();
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
basketModel.addItem(apiProducts.items[2]);

console.log("Товары в корзине: ", basketModel.getBasketItems());
console.log("Всего товаров в корзине: ", basketModel.getItemsTotal());
console.log("Товаров в корзине на общую сумму: ", basketModel.getTotalPrice());
console.log("Наличие в корзине товара \"софт-скил\" (поиск по id): ", basketModel.checkItemById(apiProducts.items[0].id));

basketModel.removeItem(apiProducts.items[0]);
console.log("Товары в корзине: ", basketModel.getBasketItems());

basketModel.emptyBasket();
console.log("Товары в корзине: ", basketModel.getBasketItems());

const baseApi = new Api(API_URL);
const localApi = new WebLarekApi(baseApi);

async function getProducts() {
  try {
    const productsModelApi = new Products();
    const products = await localApi.getData();
    productsModelApi.setItems(products);

    console.log("Каталог товаров: ", productsModelApi.getItems());
  } catch (error) {
    console.error("Ошибка при получении каталога товаров: ", error);
  }  
}

getProducts();


// Тестирование слоя представления




// const events: IEvents = new EventEmitter();

// events.on('catalog:changed', () => {
//   const itemCards = productsModel.getItems().map((item) => {
//     const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
//       onClick: () => events.emit('card:select', item),
//     });
//     return card.render({ catalog: itemCards });
//   })
// });








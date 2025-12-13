import './scss/styles.scss';
import { Buyer } from './components/Models/Buyer';
import { Basket } from './components/Models/Basket';
import { Products } from './components/Models/Products';
import { IProduct, IOrderRequest } from './types';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { EventEmitter, IEvents } from './components/base/Events';
import { CardCatalog } from './components/views/CardCatalog';
import { OrderForm } from './components/views/OrderForm';
import { ensureElement } from './utils/utils';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { OrderSuccess } from './components/views/OrderSuccess';
import { CardPreview } from './components/views/CardPreview';
import { BasketView } from './components/views/BasketView';
import { CardBasket } from './components/views/CardBasket';
import { ContactsForm } from './components/views/ContactsForm';

const events: IEvents = new EventEmitter();
const productsModel = new Products(events);
const basketModel = new Basket(events);
const header = new Header(events, ensureElement('.header'));
const modal = new Modal(events, ensureElement('.modal'));
const gallery = new Gallery(ensureElement('.gallery'));
const basket = new BasketView(events, cloneTemplate('#basket'));
const orderForm = new OrderForm(events, cloneTemplate('#order'));
const contactsForm = new ContactsForm(events, cloneTemplate('#contacts'));
const buyer = new Buyer(events);
const success = new OrderSuccess(events, cloneTemplate('#success'));
const cardPreviewCurrent = new CardPreview(events, cloneTemplate('#card-preview'));

const baseApi = new Api(API_URL);
const localApi = new WebLarekApi(baseApi);



async function getProducts() {
  try {
    const products = await localApi.getData();
    products.items.forEach(item => item.image = `${CDN_URL}${item.image}`);
    productsModel.setItems(products.items);
  } catch (error) {
    console.error("Ошибка при получении каталога товаров: ", error);
  }  
}

getProducts();

// Gallery, CardCatalog, CardPreview

events.on('catalog:changed', () => {
  const products = productsModel.getItems().map((product) => {
    const card = new CardCatalog(cloneTemplate('#card-catalog'), {
      onClick: () => events.emit('product:selected', product)
    });
    return card.render(product);
  })
  gallery.render({ catalog: products });
});

events.on('product:selected', (product: IProduct) => {
  productsModel.setItem(product);
});

events.on('selectedProduct:changed', (product: IProduct) => {  
  if (!product.price) {
    cardPreviewCurrent.disableButton(true);
  } else {
    cardPreviewCurrent.disableButton(false);
    cardPreviewCurrent.changeButton(basketModel.checkItemById(product.id));
  }
  modal.content = cardPreviewCurrent.render(product);
  modal.showModal(true);
});

// Закрытие модального окна при нажатии на крестик и вне области модального окна
events.on('modal:closed', () => {
  modal.showModal(false);
})

// Обработка нажатия на кнопку "В корзину" или "Удалить из корзины" в превью карточки
events.on('cardButton:click', () => {
  const selectedItem = productsModel.getItem();
  if (!basketModel.checkItemById(selectedItem.id)) {
    basketModel.addItem(selectedItem);
  } else {
    basketModel.removeItem(selectedItem);
  }
  modal.showModal(false);   
});

// Обработка изменений в данных корзины
events.on('basket:changed', () => {
  // Обновление контента в отображаемом превью карточки
  const product = productsModel.getItem();
  header.counter = basketModel.getItemsTotal();
  cardPreviewCurrent.changeButton(basketModel.checkItemById(product.id));
  
  // Обновление контента в отображаемой корзине с товарами
  const basketProducts = basketModel.getBasketItems().map((product, index) => {
    const cardBasket = new CardBasket(cloneTemplate('#card-basket'), {
      onClick: () => events.emit('basketItem:deleted', product)
    });
    cardBasket.index = index + 1;
    return cardBasket.render(product);
  });
  
  basket.content = basketProducts;  
  basket.price = basketModel.getTotalPrice();
  basket.buttonDisabled = basketModel.getItemsTotal() === 0 ? true : false;  
});

events.on('basketItem:deleted', (product: IProduct) => {
  basketModel.removeItem(product);
})

events.on('basket:open', () => {
  basket.buttonDisabled = basketModel.getItemsTotal() === 0 ? true : false;
  modal.content = basket.render();
  modal.showModal(true);
});

// Обработка нажатия на кнопку "Оформить" в корзине с товарами
events.on('basketButton:clicked', () => {
  const errors = buyer.checkData();
  const buyerData = buyer.getData();

  modal.content = orderForm.render({
    address: buyerData.address,
    payment: buyerData.payment,
    ready: !errors.payment && !errors.address,
    error: [errors.payment, errors.address]
      .filter(str => str !== undefined && str !== "")
      .join('. ')
  })
});

// Обработка событий в формах
events.on('payment:select', ({ key, value }: { key: string, value: string }) => {
  buyer.setData(key, value);
});

events.on('address:input', ({ key, value }: { key: string, value: string }) => {
  buyer.setData(key, value); 
});

events.on('order:continue', () => {
  modal.content = contactsForm.render();
});

events.on('email:input', ({ key, value }: { key: string, value: string }) => {
  buyer.setData(key, value);
});

events.on('phone:input', ({ key, value }: { key: string, value: string }) => {
  buyer.setData(key, value);
});

// Обработка изменений в данных покупателя
events.on('buyerData:changed', () => {
  const buyerData = buyer.getData();
  const errors = buyer.checkData();

  orderForm.render({
    address: buyerData.address,
    payment: buyerData.payment,
    ready: !errors.payment && !errors.address,
    error: [errors.payment, errors.address]
      .filter(str => str !== undefined && str !== "")
      .join('. ')
  })

  contactsForm.render({
    email: buyerData.email,
    phone: buyerData.phone,
    ready: !errors.email && !errors.phone,
    error: [errors.email, errors.phone]
      .filter(str => str !== undefined && str !== "")
      .join('. ')
  })  
});

// Отправка данных на сервер и сообщение об успешной оплате
events.on('order:pay', () => {
  async function postOrder() {
  try {
    const buyerData = buyer.getData();
    const purchaseData = basketModel.getBasketItems().map(item => {
      return item.id;
    });
    const totalPrice = basketModel.getTotalPrice();
    const orderData: IOrderRequest = Object.assign({}, {...buyerData, items: purchaseData, total: totalPrice});
    const postResponse = await localApi.postData(orderData);
    if ('total' in postResponse) {
      success.sum = postResponse.total;
      modal.content = success.render();
      basketModel.emptyBasket();
      buyer.emptyData();
    } else {
      console.error('Ошибка заказа: ', postResponse.error);
    }        
  } catch (error) {
    console.error("Ошибка: ", error);
  }
  }
  postOrder();
});

events.on('shopping:continue', () => {
  modal.showModal(false);
});






import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Buyer } from './components/Models/Buyer';
import { Basket } from './components/Models/Basket';
import { Products } from './components/Models/Products';
import { IBuyer } from './types';
import { IProduct } from './types';
import { Api, WebLarekApi } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { EventEmitter, IEvents } from './components/base/Events';
import { CardCatalog } from './components/views/CardCatalog';
import { OrderForm } from './components/views/OrderForm';
import { ensureElement, ensureAllElements } from './utils/utils';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { OrderSuccess } from './components/views/OrderSuccess';
import { CardPreview, CardPreview } from './components/views/CardPreview';
import { TCardPreview } from './components/views/CardPreview';
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



const baseApi = new Api(API_URL);
const localApi = new WebLarekApi(baseApi);



async function getProducts() {
  try {
    const products = await localApi.getData();
    products.items.forEach(item => item.image = `${CDN_URL}${item.image}`);
    productsModel.setItems(products.items);
    console.log("Каталог товаров: ", productsModel.getItems());
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

let cardPreviewCurrent: CardPreview;
events.on('selectedProduct:changed', (product: IProduct) => {  
  cardPreviewCurrent = new CardPreview(events, cloneTemplate('#card-preview'));
  cardPreviewCurrent.changeButton(basketModel.checkItemById(product.id)); 
  modal.content = cardPreviewCurrent.render(product);
  modal.showModal(true);
});

events.on('modal:closed', () => {
  modal.showModal(false);
})

events.on('cardButton:click', () => {
  if (!basketModel.checkItemById(productsModel.getItem().id)) {
    basketModel.addItem(productsModel.getItem());
  } else {
    basketModel.removeItem(productsModel.getItem());
  }    
});


events.on('basket:changed', () => {
  // Обновление контента в отображаемом превью карточки
  const product = productsModel.getItem();
  header.counter = basketModel.getItemsTotal();
  cardPreviewCurrent.changeButton(basketModel.checkItemById(product.id));
  
  // обновление контента в отображаемой корзине с товарами
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

const orderForm = new OrderForm(events, cloneTemplate('#order'));
const contactsForm = new ContactsForm(events, cloneTemplate('#contacts'));
const buyer = new Buyer(events);


events.on('basketButton:clicked', () => {  
  modal.content = orderForm.render();
});

events.on('payment:select', ({ key, value }: { key: string, value: string }) => {
  buyer.setData(key, value);  
  console.log(buyer.getData());  
});

events.on('address:input', ({ key, value }: { key: string, value: string }) => {
  buyer.setData(key, value);
  console.log(buyer.getData());  
});

events.on('order:continue', () => {
  contactsForm.error = "";
  modal.content = contactsForm.render();
  console.log(buyer.checkData());
});

events.on('email:input', ({ key, value }: { key: string, value: string }) => {
  buyer.setData(key, value);
  console.log(buyer.getData());
});

events.on('phone:input', ({ key, value }: { key: string, value: string }) => {
  buyer.setData(key, value);
  console.log(buyer.getData());
});

events.on('buyerData:changed', () => {
  const errors = buyer.checkData();
  orderForm.payment = buyer.getData().payment;
  console.log(errors);

  if (errors.address) {
    orderForm.error = errors.address as string;
  } else if (errors.payment) {
    orderForm.error = errors.payment as string;
  } else {
    orderForm.error = "";
  }

  if (errors.email) {
    contactsForm.error = errors.email as string;
  } else if (errors.phone) {
    contactsForm.error = errors.phone as string;
  } else {
    contactsForm.error = "";
  }

  orderForm.ready = !errors.payment && !errors.address;
  contactsForm.ready = !errors.email && !errors.phone;
});

// ОТправить данные на сервер Postman
// {
//     "payment": "online",
//     "email": "test@test.ru",
//     "phone": "+71234567890",
//     "address": "Spb Vosstania 1",
//     "total": 2200,
//     "items": [
//         "854cef69-976d-4c2a-a18c-2aa45046c390",
//         "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
//     ]
// }

events.on('order:pay', () => {
  // async function postOrder() {
  // try {
    const buyerData = buyer.getData();
    console.log(buyerData);
    const orderData = basketModel.getBasketItems().map(item => {
      return item.id;
    });
    console.log(orderData);
    const totalPrice = basketModel.getTotalPrice();
    console.log(totalPrice);
//     
//   } catch (error) {
//     console.error("Ошибка: ", error);
//   }  
// }
})


// OrderSuccess
// const success = new OrderSuccess(events, cloneTemplate('#success'));
// modal.content = success.render();
// events.on('continueButton:click', () => {
//   modal.showModal(false);
// });





// const events: IEvents = new EventEmitter();

// events.on('catalog:changed', () => {
//   const itemCards = productsModel.getItems().map((item) => {
//     const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
//       onClick: () => events.emit('card:select', item),
//     });
//     return card.render({ catalog: itemCards });
//   })
// });

// Тестирование слоя представления



// const events = new EventEmitter();
// const order = new OrderForm(events, cloneTemplate('#order'));

// function init() {
//     order.render();
// }

// init()

// events.on('payment:select', (data: {name: string}) => {
//   buyerModel.setData('payment', data.name);
// })

// console.log("Данные покупателя: ", buyerModel.getData());

// Куда вписывать событие? В модель? Посмотреть этот момент в воркшопе 8 спринта
// Где в  восьмом спринте выводились ошибки ввода? ("Укажите емэйл")

// const checkedBuyerData = events.on('buyerData:changed', () => {
//   buyerModel.checkData(); // @TODO добавить событие в модель данных.
// })

// events.on('buyerdata:checked', (checkedBuyerData) => {
//   order.render(checkedBuyerData); // @TODO добавить событие в модель данных.
// })








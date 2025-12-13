import { IApi, IOrderRequest, IOrderResponse, IErrorResponse, IProductListResponse } from '../types/index';

export class WebLarekApi {  
    private localApi: IApi;

    constructor (localApi: IApi) {
        this.localApi = localApi;
    }

    getData(): Promise<IProductListResponse> {
        return this.localApi.get('/product/');
    }

    postData(order: IOrderRequest): Promise<IOrderResponse | IErrorResponse> {
        return this.localApi.post('/order/', order);
    }
}
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
import { IApi } from '../../types/index';
import { IProduct } from '../../types/index';
import { IOrderRequest } from '../../types/index';
import { IOrderResponse } from '../../types/index';
import { IErrorResponse } from '../../types/index';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    get<T extends object>(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse<T>);
    }

    post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse<T>);
    }
}

export class WebLarekApi {  
    private localApi: IApi;

    constructor (localApi: IApi) {
        this.localApi = localApi;
    }

    getData(): Promise<IProduct[]> {
        return this.localApi.get('/product/');
    }

    postData(order: IOrderRequest): Promise<IOrderResponse | IErrorResponse> {
        return this.localApi.post('/order/', order);
    }
}
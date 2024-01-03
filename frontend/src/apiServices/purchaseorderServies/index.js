import * as request from '~/utils/request';

export const getAllPurchaseOrders = async (params) => {
    try {
        const response = await request.getMethod('PurchaseOrders?', {
            params,
            paramsSerializer: (params) => {
                const serializedParams = Object.keys(params).map((key) => {
                    return key + '=' + params[key];
                }).join('&');

                console.log(serializedParams);

                return serializedParams;
            },
        });

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getPurchaseOrder = async (id) => {
    try {
        const res = await request.getMethod('PurchaseOrders/' + id);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const CreatePurchaseOrder = async (obj) => {
    try {
        const res = await request.postMethod('PurchaseOrders', obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const UpdatePurchaseOrder = async (id, obj) => {
    try {
        const res = await request.putMethod('PurchaseOrders/' + id, obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getPurchaseOrderFromSupplier = async (id) => {
    try {
        const res = await request.getMethod(`PurchaseOrders?pageSize=${-1}&pageNumber=${1}&supplierIds=${id}`);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}
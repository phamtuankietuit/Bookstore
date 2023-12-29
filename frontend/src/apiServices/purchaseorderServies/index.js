import * as request from '~/utils/request';

export const getAllPurchaseOrders = async () => {
    try {
        const res = await request.getMethod('PurchaseOrders');

        return res;
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
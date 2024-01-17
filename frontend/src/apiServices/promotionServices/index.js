import * as request from '~/utils/request';

export const getAllPromotions = async (params) => {
    try {
        const response = await request.getMethod('Promotions?', {
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

export const getPromotionsForSale = async (price) => {
    try {
        const res = await request.getMethod(`Promotions?pageSize=${-1}&pageNumber=${1}&salesOrderPrice=${price}&statuses=running&isOutdated=false`);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getPromotion = async (id) => {
    try {
        const res = await request.getMethod('Promotions/' + id);
        console.log(res);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const UpdatePromotion = async (id, obj) => {
    try {
        const res = await request.putMethod('Promotions/' + id, obj);
        console.log(res);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const CreatePromotion = async (obj) => {
    try {
        const res = await request.postMethod('Promotions', obj);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}
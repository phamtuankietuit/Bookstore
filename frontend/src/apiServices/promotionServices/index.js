import * as request from '~/utils/request';

export const getAllPromotions = async () => {
    try {
        const res = await request.getMethod(`Promotions`);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getPromotionsForSale = async (price) => {
    try {
        const res = await request.getMethod(`Promotions?pageSize=${-1}&pageNumber=${1}&salesOrderPrice=${price}&statuses=running`);

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
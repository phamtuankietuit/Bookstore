import * as request from '~/utils/request';

export const getAllPromotions = async () => {
    try {
        const res = await request.getMethod('Promotions');

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
import * as request from '~/utils/request';

export const getAllPromotions = async () => {
    try {
        const res = await request.getMethod('Promotions');

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}
import * as request from '~/utils/request';

export const getAllProducts = async (id) => {
    try {
        const res = await request.get('posts/', {
            params: {
                id
            }
        });
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}


import * as request from '~/utils/request';

export const getAllProducts = async (pageNumber, pageSize) => {
    try {
        const res = await request.getMethod(`Products?pageSize=${pageSize}&pageNumber=${pageNumber}&sortBy=categoryId&orderBy=asc`);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getProduct = async (id) => {
    try {
        const res = await request.getMethod('Products/' + id);
        console.log(res);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const UpdateProduct = async (obj) => {
    try {
        const res = await request.putMethod('Products', obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

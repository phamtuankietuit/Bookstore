import * as request from '~/utils/request';

export const CreateCustomer = async (obj) => {
    try {
        const res = await request.postMethod('Customers', obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getAllCustomerTwo = async (pageNumber, pageSize) => {
    try {
        const res = await request.getMethod(`Customers?pageSize=${pageSize}&pageNumber=${pageNumber}&sortBy=categoryId&orderBy=asc`);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getCustomer = async (id) => {
    try {
        const res = await request.getMethod('Customers/' + id);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateCustomer = async (id, obj) => {
    try {
        const res = await request.putMethod('Customers/' + id, obj);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}


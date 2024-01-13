import * as request from '~/utils/request';

export const getAllCustomers = async (params) => {
    try {
        const response = await request.getMethod('Customers?', {
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
        const res = await request.getMethod(`Customers?pageSize=${pageSize}&pageNumber=${pageNumber}`);

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

export const deleteCustomer = async (customers) => {
    try {
        const res = await request.deleteMethod(`Customers?${customers.map((customer) => 'ids=' + customer.customerId).join('&')}`);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}


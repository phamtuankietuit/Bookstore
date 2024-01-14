import * as request from '~/utils/request';

export const getAllProducts = async (params) => {
    try {
        const response = await request.getMethod('Products?', {
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
export const getAllProductsTwo = async (pageNumber, pageSize) => {
    try {
        const res = await request.getMethod(`Products?pageSize=${pageSize}&pageNumber=${pageNumber}&sortBy=categoryId&orderBy=asc`);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}
export const getProductsOfSupplier = async (pageNumber, pageSize, supplierIds) => {
    try {
        const res = await request.getMethod(`Products?pageSize=${pageSize}&pageNumber=${pageNumber}&sortBy=categoryId&orderBy=asc&supplierIds=${supplierIds}`);

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

export const deleteProducts = async (products) => {
    try {
        const res = await request.deleteMethod(`Products?${products.map((product) => 'ids=' + product.productId).join('&')}`);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateProduct = async (id, obj) => {
    try {
        const res = await request.putMethod('Products/' + id, obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getDetails = async (propName) => {
    try {
        const response = await request.getMethod('Products/details/' + propName);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const createProduct = async (obj) => {
    try {
        const response = await request.postMethod('Products', obj);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const uploadImage = async (obj) => {
    try {
        const response = await request.postMethod('Products/images', obj);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const deleteImage = async (blobName) => {
    try {
        const response = await request.deleteMethod('Products/images/' + blobName);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}




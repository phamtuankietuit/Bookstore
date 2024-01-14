import * as request from '~/utils/request';

export const getAllProductTypes = async (params) => {
    try {
        const res = await request.getMethod('Categories?', {
            params,
            paramsSerializer: (params) => {
                const serializedParams = Object.keys(params).map((key) => {
                    return key + '=' + params[key];
                }).join('&');

                console.log(serializedParams);

                return serializedParams;
            },
        });

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const createProductType = async (type) => {
    try {
        const res = await request.postMethod('Categories', type);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const deleteProductType = async (types) => {
    try {
        const res = await request.deleteMethod(`Categories?${types.map((type) => 'ids=' + type.categoryId).join('&')}`);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateProductType = async (id, newObject) => {
    try {
        const res = await request.putMethod(`Categories/${id}`, newObject);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

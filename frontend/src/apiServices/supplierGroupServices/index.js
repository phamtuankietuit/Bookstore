import * as request from '~/utils/request';

export const getAllSupplierGroups = async (params) => {
    try {
        const response = await request.getMethod('SupplierGroups?', {
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

export const CreateSupplierGroup = async (obj) => {
    try {
        const res = await request.postMethod('SupplierGroups', obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const deleteSupplierGroups = async (items) => {
    try {
        const res = await request.deleteMethod(`SupplierGroups?${items.map((item) => 'ids=' + item.supplierGroupId).join('&')}`);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateSupplierGroup = async (id, obj) => {
    try {
        const res = await request.putMethod('SupplierGroups?' + id, obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

import * as request from '~/utils/request';


export const getSuppliers = async (params) => {
    try {
        const response = await request.getMethod('Suppliers?', {
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

export const getAllSupplierGroups = async (pageNumber, pageSize) => {
    try {
        const res = await request.getMethod(`SupplierGroups?pageSize=${pageSize}&pageNumber=${pageNumber}`);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}


export const getSupplier = async (id) => {
    try {
        const res = await request.getMethod('Suppliers/' + id);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const UpdateSupplier = async (id, obj) => {
    try {
        const res = await request.putMethod('Suppliers/' + id, obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const deleteSupplier = async (suppliers) => {
    try {
        const res = await request.deleteMethod(`Suppliers?${suppliers.map((supplier) => 'ids=' + supplier.supplierId).join('&')}`);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const CreateSuppliers = async (obj) => {
    try {
        const res = await request.postMethod('Suppliers', obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}


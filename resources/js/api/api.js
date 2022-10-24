import axios from 'axios';
import baseURL from './baseURL';

const axiosProtected = axios.create({
    baseURL: baseURL + '/api',
    withCredentials: true,
});

axiosProtected.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response.status === 401 || err.response.status === 429) {
            window.location = '/login';
            return Promise.reject(err);
        }

        return Promise.reject(err);
    }
);

//sales
export const postSale = (name, variant, invoice, price, shipping, buyer, date, isFeatured = false, isSale = false) => {
    return axiosProtected.post('/sold', {
        ProductName: name,
        ProductVariant: variant,
        Invoice: invoice,
        Featured: isFeatured,
        Sale: isSale,
        PriceSold: price,
        Shipping: shipping,
        Buyer: buyer,
        DateSold: date,
    });
};

export const getLastItemByNameVariant = (name, variant) => {
    return axiosProtected.get(`/sold/requestLastItemByNameVariant/${name}/${variant}`);
};

export const getSales = (page) => {
    return axiosProtected.get(`/sold?page=${page}`);
};

export const showSale = (id) => {
    return axiosProtected.get(`/sold/byid/${id}`);
};

export const searchSales = (query) => {
    return axiosProtected.get(`/sold/search/${query}`);
};

export const getSalesByDate = (date, invoice = 1) => {
    return axiosProtected.get(baseURL + `/api/sold/${date}/${invoice}`);
};

export const deleteSale = (id) => {
    return axiosProtected.delete(`/sold/${id}`);
};

export const cancelSale = (id) => {
    return axiosProtected.delete(`/sold/cancel/${id}`);
};

export const updateSale = (id, toEdit) => {
    return axiosProtected.put(`/sold/${id}`, {
        ProductName: toEdit.ProductName,
        ProductVariant: toEdit.ProductVariant,
        Invoice: toEdit.Invoice,
        PriceSold: toEdit.PriceSold,
        Shipping: toEdit.Shipping,
        Buyer: toEdit.Buyer,
        Profit: toEdit.Profit,
        DateSold: toEdit.DateSold,
    });
};

export const getReturns = (page) => {
    return axiosProtected.get(`/returns?page=${page}`);
};

export const getNumberOfReturns = (from, to) => {
    return axiosProtected.get(`/returns/numberof/${from}/${to}`);
};

export const addReturn = (id, returnDate) => {
    return axiosProtected.post(`/returns`, {
        id: id,
        returned_at: returnDate,
    });
};

export const returnToSold = (id) => {
    return axiosProtected.post(`/returns/returntosold`, {
        id: id,
    });
};

export const serachReturns = (query) => {
    return axiosProtected.get(`/returns/search/${query}`);
};

export const getVariants = () => {
    return axiosProtected.get(baseURL + '/api/variants');
};

export const addProduct = (name) => {
    return axiosProtected.post(baseURL + '/api/products', {
        ProductName: name,
    });
};

export const getProducts = () => {
    return axiosProtected.get(baseURL + '/api/products/withvariants');
};

export const getProductsWithQuantity = () => {
    return axiosProtected.get(baseURL + '/api/products/withquantity');
};

export const deleteProduct = (id) => {
    return axiosProtected.delete(`/products/${id}`);
};

export const addVariant = (id, variant, variantImg) => {
    const data = new FormData();
    data.append('VariantName', variant);
    data.append('ProductID', id);

    if (variantImg) {
        data.append('VariantImage', variantImg);
        console.log('variant img detected');
    }

    return axiosProtected.post(`/variants`, data);
};

export const deleteVariant = (id) => {
    return axiosProtected.delete(`/variants/${id}`);
};

export const addCollection = (PriceTotal, DateBought) => {
    return axiosProtected.post(baseURL + '/api/collections', {
        PriceTotal: PriceTotal,
        DateBought: DateBought,
    });
};

export const addWarehouse = (
    collectionID,
    ProductName,
    ProductVariant,
    Quantity,
    PriceBought,
    DateBought,
    UnitPrice
) => {
    return axiosProtected.post(baseURL + '/api/warehouse', {
        CollectionID: collectionID,
        ProductName: ProductName,
        ProductVariant: ProductVariant,
        Quantity: Quantity,
        OriginalQuantity: Quantity,
        PriceBought: PriceBought,
        DateBought: DateBought,
        UnitPrice: UnitPrice,
    });
};

export const deleteCollection = (id) => {
    return axiosProtected.delete(`/collections/${id}`);
};

export const getProfit = (from, to) => {
    return axiosProtected.get(`/stats/profit/${from}/${to}`, {});
};

export const getProfitForYear = () => {
    return axiosProtected.get(`/stats/profit/year`);
};

export const getBestPerforming = () => {
    const from = '2021-01-01';
    const to = '2022-12-12';
    return axiosProtected.get(`/stats/bestperforming/${from}/${to}`);
};

export const getWarehouseWithProducts = () => {
    return axiosProtected.get(`/collections/withproducts`);
};

export const getShippingOptions = () => {
    return axiosProtected.get(`/shippingoptions`);
};

export const addShippingOption = (name, value) => {
    return axiosProtected.post(`/shippingoptions`, {
        name: name,
        value: value,
    });
};

export const deleteShippingOption = (id) => {
    return axiosProtected.delete(`/shippingoptions/${id}`);
};

export const getUserDetailsGeneral = () => {
    return axiosProtected.get('/user/details/general');
};

export const getUserFees = () => {
    return axiosProtected.get('/user/details/fees');
};

export const updateUserFees = (fees) => {
    return axiosProtected.put('/user/details/fees', fees);
};

export const sanctum = () => {
    return axios.get(baseURL + '/sanctum/csrf-cookie', { withCredentials: true }).catch((err) => {
        console.log(err);
        err.response ? console.log(err.response) : null;
    });
};

export const login = (email, password) => {
    return axiosProtected.post('/login', {
        email: email,
        password: password,
    });
};

export const register = (name, email, password) => {
    return axiosProtected.post('/register', {
        name: name,
        email: email,
        password: password,
        password_confirmation: password,
    });
};

export const logout = () => {
    return axiosProtected.post('/logout', {}).catch((err) => {
        console.log(err);
        err.response ? console.log(err.response) : null;
    });
};

export const updatePassword = (oldPassword, newPassword) => {
    return axiosProtected.put('/user/password', {
        password: oldPassword,
        new_password: newPassword,
    });
};

export const test = () => {
    return axiosProtected.get('/test').catch((err) => {
        console.log(err);
        err.response ? console.log(err.response) : null;
    });
};

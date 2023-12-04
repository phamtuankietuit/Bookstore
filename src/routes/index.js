// Layouts

// Pages
import Login from '~/pages/Login';
import ListProduct from '~/pages/ListProduct';
import AddProduct from '~/pages/AddProduct';
import Profile from '~/pages/Profile';
import StoreInfo from '~/pages/StoreInfo';
import AddDiscount from '~/pages/AddDiscount';

const publicRoutes = [
    { path: '/', component: Login, layout: null, title: 'Login' },
    {
        path: '/listproduct',
        component: ListProduct,
        title: 'Danh sách sản phẩm',
    },
    { path: '/addproduct', component: AddProduct, title: 'Quay lại' },
    {
        path: '/profile',
        component: Profile,
        layout: null,
    },
    {
        path: '/storeinfo',
        component: StoreInfo,
        layout: null,
    },
    { path: '/adddiscount', component: AddDiscount, title: 'Quay lại' },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

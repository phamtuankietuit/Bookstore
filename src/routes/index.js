// Layouts

// Pages
import Login from '~/pages/Login';
import ListProduct from '~/pages/ListProduct';
import AddProduct from '~/pages/AddProduct';
import Profile from '~/pages/Profile';
import StoreInfo from '~/pages/StoreInfo';

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
        title: 'Trang cá nhân',
    },
    {
        path: '/storeinfo',
        component: StoreInfo,
        layout: null,
        title: 'Thông tin cửa hàng',
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

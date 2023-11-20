// Layouts

// Pages
import Login from '~/pages/Login';
import ListProduct from '~/pages/ListProduct';
import AddProduct from '~/pages/AddProduct';

const publicRoutes = [
    { path: '/', component: Login, layout: null, title: 'Login' },
    { path: '/listproduct', component: ListProduct, title: 'Danh sách sản phẩm' },
    { path: '/addproduct', component: AddProduct, title: 'Quay lại' },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

// Layouts

// Pages
import Login from '~/pages/Login';
import ListProduct from '~/pages/ListProduct';
import AddProduct from '~/pages/AddProduct';

const publicRoutes = [
    { path: '/', component: Login, layout: null },
    { path: '/listproduct', component: ListProduct },
    { path: '/addproduct', component: AddProduct },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

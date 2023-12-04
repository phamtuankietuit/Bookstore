// Pages
import Login from '~/pages/Login';
import ListProduct from '~/pages/ListProduct';
import AddProduct from '~/pages/AddProduct';
import InfoProduct from '~/pages/InfoProduct';
import TypeProduct from '~/pages/TypeProduct';
import ImportProduct from '~/pages/ImportProduct';
import UpdateImportProduct from '~/pages/UpdateImportProduct';
import InfoImportProduct from '~/pages/InfoImportProduct';
import AddCheckProduct from '~/pages/AddCheckProduct';
import InfoCheckProduct from '~/pages/InfoCheckProduct';
import UpdateCheckProduct from '~/pages/UpdateCheckProduct';
const publicRoutes = [
    { path: '/', component: Login, layout: null, title: 'Login' },
    {
        path: '/listproduct',
        component: ListProduct,
        title: 'Danh sách sản phẩm',
    },
    { path: '/addproduct', component: AddProduct, title: 'Quay lại' },
    { path: '/infoproduct/:id', component: InfoProduct, title: 'Quay lại' },
    { path: '/typeproduct', component: TypeProduct, title: 'Loại sản phẩm' },
    { path: '/importproduct', component: ImportProduct, title: 'Quay lại' },
    { path: '/updateimportproduct/:id', component: UpdateImportProduct, title: 'Quay lại' },
    { path: '/infoimportproduct/:id', component: InfoImportProduct, title: 'Quay lại' },
    { path: '/addcheckproduct', component: AddCheckProduct, title: 'Quay lại' },
    { path: '/infocheckproduct/:id', component: InfoCheckProduct, title: 'Quay lại' },
    { path: '/updatecheckproduct/:id', component: UpdateCheckProduct, title: 'Quay lại' },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

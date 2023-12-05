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
    { path: '/addcheckproduct', component: AddCheckProduct, title: 'Tạo đơn kiểm hàng', back: true},
    { path: '/infocheckproduct/:id', component: InfoCheckProduct, title: 'Chi tiết đơn kiểm hàng', back: true},
    { path: '/updatecheckproduct/:id', component: UpdateCheckProduct, title: 'Chỉnh sửa đơn kiểm hàng', back: true},
    { path: '/importproduct', component: ImportProduct, title: 'Tạo đơn nhập hàng', back: true},
    { path: '/updateimportproduct/:id', component: UpdateImportProduct, title: 'Chỉnh sửa đơn nhập hàng', back: true},
    { path: '/infoimportproduct/:id', component: InfoImportProduct, title: 'Chi tiết đơn nhập hàng', back: true },
    {
        path: '/addproduct',
        component: AddProduct,
        title: 'Thêm sản phẩm',
        back: true,
    },
    {
        path: '/infoproduct/:id',
        component: InfoProduct,
        title: 'Chi tiết sản phẩm',
    },
    {
        path: '/typeproduct',
        component: TypeProduct,
        title: 'Loại sản phẩm',
        back: true,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

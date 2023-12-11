// Pages
import Login from '~/pages/Login';
import ListProduct from '~/pages/ListProduct';
import AddProduct from '~/pages/AddProduct';
import Profile from '~/pages/Profile';
import StoreInfo from '~/pages/StoreInfo';
import AddDiscount from '~/pages/AddDiscount';
import InfoProduct from '~/pages/InfoProduct';
import TypeProduct from '~/pages/TypeProduct';
import ImportProduct from '~/pages/ImportProduct';
import UpdateImportProduct from '~/pages/UpdateImportProduct';
import InfoImportProduct from '~/pages/InfoImportProduct';
import AddCheckProduct from '~/pages/AddCheckProduct';
import InfoCheckProduct from '~/pages/InfoCheckProduct';
import UpdateCheckProduct from '~/pages/UpdateCheckProduct';
import DiscountInfo from '~/pages/DiscountInfo';
import EditDiscount from '~/pages/EditDiscount';

const publicRoutes = [
    { path: '/', component: Login, layout: null, title: 'Login' },
    {
        path: '/listproduct',
        component: ListProduct,
        title: 'Danh sách sản phẩm',
    },
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
    {
        path: '/adddiscount',
        component: AddDiscount,
        title: 'Thêm khuyến mãi',
        back: true,
    },
    {
        path: '/addcheckproduct',
        component: AddCheckProduct,
        title: 'Tạo đơn kiểm hàng',
        back: true,
    },
    {
        path: '/infocheckproduct/:id',
        component: InfoCheckProduct,
        title: 'Chi tiết đơn kiểm hàng',
        back: true,
    },
    {
        path: '/updatecheckproduct/:id',
        component: UpdateCheckProduct,
        title: 'Chỉnh sửa đơn kiểm hàng',
        back: true,
    },
    {
        path: '/importproduct',
        component: ImportProduct,
        title: 'Tạo đơn nhập hàng',
        back: true,
    },
    {
        path: '/updateimportproduct/:id',
        component: UpdateImportProduct,
        title: 'Chỉnh sửa đơn nhập hàng',
        back: true,
    },
    {
        path: '/infoimportproduct/:id',
        component: InfoImportProduct,
        title: 'Chi tiết đơn nhập hàng',
        back: true,
    },
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
    {
        path: '/discountinfo',
        component: DiscountInfo,
        title: 'Thông tin khuyến mãi',
        back: true,
    },
    {
        path: '/editdiscount',
        component: EditDiscount,
        title: 'Sửa khuyến mãi',
        back: true,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

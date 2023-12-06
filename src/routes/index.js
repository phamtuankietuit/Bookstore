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
import ListDiscount from '~/pages/ListDiscount';
import ListImport from '~/pages/ListImport';
import ListCheck from '~/pages/ListCheck';

const publicRoutes = [
    // ACCOUNT
    { path: '/', component: Login, layout: null, title: 'Login' },
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
    // PRODUCT
    {
        path: '/products',
        component: ListProduct,
        title: 'Danh sách sản phẩm',
    },
    {
        path: '/products/add',
        component: AddProduct,
        title: 'Thêm sản phẩm',
        back: true,
    },
    {
        path: '/products/detail',
        component: InfoProduct,
        title: 'Chi tiết sản phẩm',
        back: true,
    },
    {
        path: '/products/type',
        component: TypeProduct,
        title: 'Loại sản phẩm',
        back: true,
    },
    // IMPORT
    {
        path: '/imports',
        component: ListImport,
        title: 'Danh sách đơn nhập hàng',
    },
    {
        path: '/imports/add',
        component: ImportProduct,
        title: 'Tạo đơn nhập hàng',
        back: true,
    },
    {
        path: '/imports/update',
        component: UpdateImportProduct,
        title: 'Chỉnh sửa đơn nhập hàng',
        back: true,
    },
    {
        path: '/imports/detail',
        component: InfoImportProduct,
        title: 'Chi tiết đơn nhập hàng',
        back: true,
    },
    // CHECK PRODUCT
    {
        path: '/checks',
        component: ListCheck,
        title: 'Danh sách đơn kiểm hàng',
    },
    {
        path: '/checks/add',
        component: AddCheckProduct,
        title: 'Tạo đơn kiểm hàng',
        back: true,
    },
    {
        path: '/checks/detail',
        component: InfoCheckProduct,
        title: 'Chi tiết đơn kiểm hàng',
        back: true,
    },
    {
        path: '/checks/update',
        component: UpdateCheckProduct,
        title: 'Chỉnh sửa đơn kiểm hàng',
        back: true,
    },
    // DISCOUNT
    {
        path: '/discounts',
        component: ListDiscount,
        title: 'Danh sách khuyến mãi',
    },
    {
        path: '/discounts/add',
        component: AddDiscount,
        title: 'Thêm khuyến mãi',
        back: true,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

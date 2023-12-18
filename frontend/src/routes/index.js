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
import ListDiscount from '~/pages/ListDiscount';
import ListImport from '~/pages/ListImport';
import ListCheck from '~/pages/ListCheck';
import InfoReturn from '~/pages/InfoReturnProduct';
import AddReturnProduct from '~/pages/AddReturnProduct';
import UpdateProduct from '~/pages/UpdateProduct';
import EditDiscount from '~/pages/EditDiscount';
import ListOrder from '~/pages/ListOrder';
import ListReturn from '~/pages/ListReturn';
import ListSupplier from '~/pages/ListSupplier';
import ListSupplierGroup from '~/pages/ListSupplierGroup';
import AddSupplier from '~/pages/AddSupplier';
import InfoSupplier from '~/pages/InfoSupplier';
import UpdateSupplier from '~/pages/UpdateSupplier';
import Sale from '~/pages/Sale';
import ListCustomer from '~/pages/ListCustomer';
import AddCustomer from '~/pages/AddCustomer';
import InfoCustomer from '~/pages/InfoCustomer';
import UpdateCustomer from '~/pages/UpdateCustomer';
import ListStaff from '~/pages/ListStaff';
import AddStaff from '~/pages/AddStaff';
import InfoStaff from '~/pages/InfoStaff';
import SellReport from '~/pages/SellReport';

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
    // ORDER
    {
        path: '/orders',
        component: ListOrder,
        title: 'Danh sách đơn hàng',
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
        path: '/products/detail/:id',
        component: InfoProduct,
        title: 'Chi tiết sản phẩm',
        back: true,
    },
    {
        path: '/products/update/:id',
        component: UpdateProduct,
        title: 'Cập nhật sản phẩm',
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
        path: '/imports/update/:id',
        component: UpdateImportProduct,
        title: 'Chỉnh sửa đơn nhập hàng',
        back: true,
    },
    {
        path: '/imports/detail/:id',
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
        path: '/checks/detail/:id',
        component: InfoCheckProduct,
        title: 'Chi tiết đơn kiểm hàng',
        back: true,
    },
    {
        path: '/checks/update/:id',
        component: UpdateCheckProduct,
        title: 'Chỉnh sửa đơn kiểm hàng',
        back: true,
    },
    // SUPPLIER
    {
        path: '/suppliers',
        component: ListSupplier,
        title: 'Danh sách nhà cung cấp',
    },
    {
        path: '/suppliers/add',
        component: AddSupplier,
        title: 'Thêm nhà cung cấp',
        back: true,
    },
    {
        path: '/suppliers/detail/:id',
        component: InfoSupplier,
        title: 'Chi tiết nhà cung cấp',
        back: true,
    },
    {
        path: '/suppliers/update/:id',
        component: UpdateSupplier,
        title: 'Cập nhật nhà cung cấp',
        back: true,
    },
    {
        path: '/suppliers/group',
        component: ListSupplierGroup,
        title: 'Danh sách nhóm nhà cung cấp',
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
    {
        path: '/discounts/detail/:id',
        component: DiscountInfo,
        title: 'Thông tin khuyến mãi',
        back: true,
    },
    {
        path: '/discounts/update/:id',
        component: EditDiscount,
        title: 'Sửa khuyến mãi',
        back: true,
    },
    // RETURN
    {
        path: '/return',
        component: ListReturn,
        title: 'Danh sách đơn trả hàng',
    },
    {
        path: '/return/add',
        component: AddReturnProduct,
        title: 'Tạo đơn trả hàng',
        back: true,
    },
    {
        path: '/return/detail/:id',
        component: InfoReturn,
        title: 'Chi tiết đơn trả hàng',
        back: true,
    },
    // SALE
    {
        path: '/sales',
        component: Sale,
        layout: null,
    },
    // CUSTOMER
    {
        path: '/customers',
        component: ListCustomer,
        title: 'Danh sách khách hàng',
    },
    {
        path: '/customers/add',
        component: AddCustomer,
        title: 'Thêm khách hàng',
        back: true,
    },
    {
        path: '/customers/detail/:id',
        component: InfoCustomer,
        title: 'Chi tiết khách hàng',
        back: true,
    },
    {
        path: '/customers/update/:id',
        component: UpdateCustomer,
        title: 'Cập nhật khách hàng',
        back: true,
    },
    // STAFF
    {
        path: '/staffs',
        component: ListStaff,
        title: 'Danh sách nhân viên',
    },
    {
        path: '/staffs/add',
        component: AddStaff,
        title: 'Thêm nhân viên',
        back: true,
    },
    {
        path: '/staffs/update/:id',
        component: InfoStaff,
        title: 'Thông tin nhân viên',
        back: true,
    },
    // REPORT
    {
        path: '/reports/revenue',
        component: SellReport,
        title: 'Báo cáo bán hàng',
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };

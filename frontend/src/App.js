import { Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

import ReturnStatic from './screens/static/ReturnStatic'
import ShippingStatic from './screens/static/ShippingStatic'
import InternationalStatic from './screens/static/InternationalStatic'
import AboutStatic from './screens/static/AboutStatic'
import ContactStatic from './screens/static/ContactStatic'

import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import InventoryListScreen from './screens/InventoryListScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import OrderListScreen from './screens/OrderListScreen'
import OrderHistoryScreen from './screens/OrderHistoryScreen'
import CategoryScreen from './screens/CategoryScreen'
import SearchScreen from './screens/SearchScreen'
import ReportsScreen from './screens/ReportsScreen'
import UploadsScreen from './screens/UploadsScreen'
import UnshippedScreen from './screens/UnshippedScreen'
import WishListScreen from './screens/WishListScreen'
import CategoryListScreen from './screens/CategoryListScreen'
import CategoryEditScreen from './screens/CategoryEditScreen'
import CategoryNewScreen from './screens/CategoryNewScreen'
import BrandListScreen from './screens/BrandListScreen'
import BrandEditScreen from './screens/BrandEditScreen'
import BrandNewScreen from './screens/BrandNewScreen'
import DiscountListScreen from './screens/DiscountListScreen'
import DiscountEditScreen from './screens/DiscountEditScreen'
import DiscountNewScreen from './screens/DiscountNewScreen'
import ProductNewScreen from './screens/ProductNewScreen'
import InventoryEditScreen from './screens/InventoryEditScreen'
import InventoryNewScreen from './screens/InventoryNewScreen'

import ShippingMethodScreen from './screens/ShippingMethodScreen'
import CategoryStatic from './screens/static/CategoryStatic'
import EmployeeHistoryScreen from './screens/EmployeeHistoryScreen'
import ProtectedRoute from './components/ProtectedRoute'
import StaffRoute from './components/StaffRoute'
import BrandsScreen from './screens/BrandsScreen'
import TestScreen from './screens/TestScreen'


const App = () => {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path='/' component={HomeScreen} />
        <Route path='/international' component={InternationalStatic} />
        <Route path='/returnpolicy' component={ReturnStatic} />
        <Route path='/shippingpolicy' component={ShippingStatic} />
        <Route path='/about' component={AboutStatic} />
        <Route path='/contact' component={ContactStatic} />
        <Route exact path='/categories' component={CategoryStatic} />

        <Route path='/brands' component={BrandsScreen} />
        <Route path='/category/:id' component={CategoryScreen} />
        <Route path='/order/:id' component={OrderScreen} />
        <Route path='/payment' component={PaymentScreen} />
        <Route path='/shipping' component={ShippingScreen} />
        <Route path='/shippingmethod' component={ShippingMethodScreen} />
        <Route path='/login' component={LoginScreen} />
        <Route path='/register' component={RegisterScreen} />
        <Route path='/product/:id' component={ProductScreen} />
        <Route exact path='/cart' component={CartScreen} />
        <Route path='/cart/:id' component={CartScreen} />
        <Route exact path='/products' component={SearchScreen} />
        <Route exact path='/search/' component={SearchScreen} />
        <Route exact path='/search/:keyword' component={SearchScreen} />
        <Route exact path='/search/:keyword/page/:pageNumber' component={SearchScreen} />
        <Route exact path='/search/:keyword/page/:pageNumber/brands/:brands' component={SearchScreen} />

        <ProtectedRoute path='/orderhistory' component={OrderHistoryScreen} />
        <ProtectedRoute path='/wishlist' component={WishListScreen} />
        <ProtectedRoute path='/profile' component={ProfileScreen} />

        <StaffRoute path='/admin/employeehistory' component={EmployeeHistoryScreen} />
        <StaffRoute path='/admin/unshipped' component={UnshippedScreen} />
        <StaffRoute path='/admin/uploads' component={UploadsScreen} />
        <StaffRoute path='/admin/reports' component={ReportsScreen} />
        <StaffRoute path='/admin/orderlist' component={OrderListScreen} />

        <StaffRoute path='/admin/userlist' component={UserListScreen} />
        <StaffRoute path='/admin/user/:id/edit' component={UserEditScreen} />

        <StaffRoute path='/admin/categorylist' component={CategoryListScreen} />
        <StaffRoute path='/admin/categorynew' component={CategoryNewScreen} />
        <StaffRoute path='/admin/category/:id/edit' component={CategoryEditScreen} />

        <StaffRoute path='/admin/productlist' component={ProductListScreen} />
        <StaffRoute path='/admin/productnew' component={ProductNewScreen} />
        <StaffRoute path='/admin/product/:id/edit' component={ProductEditScreen} />

        <StaffRoute path='/admin/inventorylist' component={InventoryListScreen} />
        <StaffRoute path='/admin/inventorynew' component={InventoryNewScreen} />
        <StaffRoute path='/admin/inventory/:id/edit' component={InventoryEditScreen} />

        <StaffRoute path='/admin/brandlist' component={BrandListScreen} />
        <StaffRoute path='/admin/brandnew' component={BrandNewScreen} />
        <StaffRoute path='/admin/brand/:id/edit' component={BrandEditScreen} />

        <StaffRoute path='/admin/discountlist' component={DiscountListScreen} />
        <StaffRoute path='/admin/discountnew' component={DiscountNewScreen} />
        <StaffRoute path='/admin/discount/:id/edit' component={DiscountEditScreen} />

        <StaffRoute path='/admin/test' component={TestScreen} />

        <Route path='*' component={HomeScreen} />
      </Switch>
      <Footer />
    </>
  );
}

export default App;

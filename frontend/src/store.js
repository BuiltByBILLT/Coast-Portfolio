import { createStore, combineReducers, applyMiddleware, } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducer, productDetailsReducer, productDeleteReducer, productCreateReducer, productUpdateReducer, productUpdateImagesReducer, productReviewCreateReducer, productTopRatedReducer, productSuggestedReducer } from './reducers/productReducers'
import { cartReducer, cloverReducer } from './reducers/cartReducers'
import { userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer } from './reducers/userReducers'
import { orderCreateReducer, orderDeliverReducer, orderDetailsReducer, orderListMyReducer, orderListReducer, orderPayReducer } from './reducers/orderReducers'
import { categoryProductsReducer, categoryDetailsReducer, categoryTopReducer } from './reducers/categoryReducers'
import { reportAverageReducer, reportLowInvReducer } from './reducers/reportReducers'

const reducer = combineReducers({
    cart: cartReducer,
    userLogin: userLoginReducer,
    clover: cloverReducer,
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productReviewCreate: productReviewCreateReducer,
    productTopRated: productTopRatedReducer,
    productSuggested: productSuggestedReducer,
    productUpdate: productUpdateReducer,
    productUpdateImages: productUpdateImagesReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    // orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    // orderPay: orderPayReducer,
    orderDeliver: orderDeliverReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
    reportLowInv: reportLowInvReducer,
    reportAverage: reportAverageReducer,
    categoryDetails: categoryDetailsReducer,
    categoryProducts: categoryProductsReducer,
    categoryTop: categoryTopReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')) : null

const cartItemsFromStorage = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems')) : []

const shippingInfoFromStorage = localStorage.getItem('shippingInfo')
    ? JSON.parse(localStorage.getItem('shippingInfo')) : {}

const shippingMethodFromStorage = localStorage.getItem('shippingMethod')
    ? JSON.parse(localStorage.getItem('shippingMethod')) : {}

// const cloverOrderFromStorage = localStorage.getItem('cloverOrder')
//     ? JSON.parse(localStorage.getItem('cloverOrder')) : null

const initialState = {
    cart: {
        cartItems: userInfoFromStorage ? userInfoFromStorage.cart : cartItemsFromStorage,
        shippingInfo: shippingInfoFromStorage,
        shippingMethod: shippingMethodFromStorage,
        // cloverOrder: cloverOrderFromStorage,
    },
    userLogin: { userInfo: userInfoFromStorage }
}


const middleware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store
import axios from 'axios'
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_INFO,
    CART_SAVE_PAYMENT_METHOD,
    CART_MODIFY_ITEM,
    CART_SAVE_SHIPPING_METHOD,
    CART_GET_CLOVER,
    CART_PUSH_CLOVER,
    SHIPPING_INFO_PUSH_CLOVER,
    CART_RESET,
    CART_LOAD_USER,
    CART_LOAD_FROM_DB,
    CART_FROM_DB_RESET,
    CLOVER_SUBMIT,
    CLOVER_SUCCESS,
    CLOVER_FAIL,
    CLOVER_RESET,
} from '../constants/cartConstants'

const storeCart = async (state, dispatch, reset) => {
    const { userLogin: { userInfo } } = state
    if (userInfo) {
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } }
        await axios.post(`/api/users/cart`, state.cart.cartItems, config)
        let newUserInfo = state.userLogin.userInfo
        newUserInfo.cart = state.cart.cartItems
        localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
    }
    localStorage.setItem('cartItems', JSON.stringify(state.cart.cartItems))

    if (reset)
        if (state.cart.cartFromDB == 'reset' || state.cart.cartFromDB == null) { }
        else { dispatch({ type: CART_FROM_DB_RESET }) }
}

export const addToCart = (product, name, qty, stock, price, cloverID) => async (dispatch, getState) => {

    // Add to Cart
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            pID: product.pID,
            cloverID,
            name,
            image: product.images[0].imageSrc,
            price,
            qty,
            countInStock: stock
        }
    })
    await storeCart(getState(), dispatch, true)
}

export const removeFromCart = (pID) => async (dispatch, getState) => {

    dispatch({
        type: CART_REMOVE_ITEM,
        payload: pID
    })
    await storeCart(getState(), dispatch, true)

}

export const modifyCart = (pID, qty) => async (dispatch, getState) => {

    dispatch({
        type: CART_MODIFY_ITEM,
        payload: { pID, qty }
    })
    await storeCart(getState(), dispatch, true)
}


export const resetCart = () => async (dispatch, getState) => {

    dispatch({
        type: CART_RESET,
    })

    localStorage.removeItem("cartItems")
    localStorage.removeItem('shippingInfo')
    localStorage.removeItem('shippingMethod')

}

export const saveShippingInfo = (shippingInfo) => async (dispatch) => {
    // dispatch({
    //     type: CART_SAVE_SHIPPING_INFO,
    //     payload: shippingInfo
    // })
    const { data } = await axios.post(`/api/clover/tax`, shippingInfo)
    // const { data: validated } = await axios.post(`/api/clover/validate`, shippingInfo)
    var infoWithTax = shippingInfo
    infoWithTax.taxRate = data || 0
    // infoWithTax.validated = validated || ""
    dispatch({
        type: CART_SAVE_SHIPPING_INFO,
        payload: infoWithTax
    })

    localStorage.setItem('shippingInfo', JSON.stringify(infoWithTax))
}

export const saveShippingMethod = (data) => async (dispatch, getState) => {
    dispatch({
        type: CART_SAVE_SHIPPING_METHOD,
        payload: data
    })
    localStorage.setItem('shippingMethod', JSON.stringify(getState().cart.shippingMethod))
}


export const cartToDB = () => async (dispatch, getState) => {
    const state = getState()
    const { userLogin: { userInfo } } = state
    const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } }
    const { data } = await axios.post(`/api/cart`, state.cart, config)
    dispatch({
        type: CART_LOAD_FROM_DB,
        payload: data
    })

}

export const loadCartFromDB = (cartId) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/cart/${cartId}`)
    dispatch({
        type: CART_LOAD_FROM_DB,
        payload: data
    })
    await storeCart(getState(), dispatch, false)
}

export const submitClover = (token) => async (dispatch, getState) => {
    try {
        dispatch({ type: CLOVER_SUBMIT })
        let state = getState()
        let body = { cart: state.cart, userLogin: state.userLogin, token }
        const { data } = await axios.post('/api/clover', body)

        dispatch({ type: CLOVER_SUCCESS, payload: data })

    } catch (error) {
        dispatch({
            type: CLOVER_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message : error.message
        })
    }
}

// export const afterOrderReset = () => async (dispatch, getState) => {
//     dispatch({ type: CLOVER_RESET })
//     dispatch({ type: CART_RESET })

//     localStorage.removeItem("cartItems")
//     localStorage.removeItem('shippingInfo')
//     localStorage.removeItem('shippingMethod')

// }


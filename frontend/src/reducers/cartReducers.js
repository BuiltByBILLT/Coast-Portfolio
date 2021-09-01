import {
    CART_ADD_ITEM,
    CART_FROM_DB_RESET,
    CART_GET_CLOVER,
    CART_LOAD_FROM_DB,
    CART_LOAD_USER,
    CART_MODIFY_ITEM,
    CART_PUSH_CLOVER,
    CART_REMOVE_ITEM,
    CART_RESET,
    CART_SAVE_PAYMENT_METHOD,
    CART_SAVE_SHIPPING_INFO,
    CART_SAVE_SHIPPING_METHOD,
    CLOVER_FAIL,
    CLOVER_RESET,
    CLOVER_SUBMIT,
    CLOVER_SUCCESS
} from '../constants/cartConstants'

export const cartReducer = (state = { cartItems: [], shippingInfo: {}, shippingMethod: {} }, action) => {
    const newItem = action.payload

    switch (action.type) {
        case CART_ADD_ITEM:
            let cleanCartItems = state.cartItems.filter(x => x.pID !== action.payload.pID)

            return {
                ...state,
                cartItems: [...cleanCartItems, newItem]
            }

        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.pID !== action.payload)
            }

        case CART_MODIFY_ITEM:
            let newCartItems = state.cartItems.map(item => {
                let newItem = { ...item }
                if (item.pID === action.payload.pID) newItem.qty = action.payload.qty
                return newItem
            })
            return {
                ...state,
                cartItems: [...newCartItems]
            }

        case CART_RESET:
            return {
                cartItems: [],
                shippingInfo: {},
                shippingMethod: {}
                // cloverOrder: null
            }


        case CART_SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload
            }

        case CART_SAVE_SHIPPING_METHOD:
            return {
                ...state,
                shippingMethod: {
                    method: action.payload.method,
                    price: action.payload.price
                }
            }

        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            }

        // case CART_GET_CLOVER:
        //     return {
        //         ...state,
        //         cloverID: action.payload
        //     }

        // case CART_PUSH_CLOVER:
        //     return {
        //         ...state,
        //         cloverOrder: action.payload
        //     }

        case CART_LOAD_USER:
            return {
                ...state,
                cartItems: action.payload
            }

        case CART_LOAD_FROM_DB:
            return {
                ...state,
                cartFromDB: action.payload.cartID,
                cartItems: action.payload.cartItems
            }
        case CART_FROM_DB_RESET:
            return {
                ...state,
                cartFromDB: "reset"
            }
        default:
            return state
    }
}

export const cloverReducer = (state = { loading: false }, action) => {
    switch (action.type) {
        case CLOVER_SUBMIT:
            return { loading: true }
        case CLOVER_SUCCESS:
            return { loading: false, order: action.payload }
        case CLOVER_FAIL:
            return { loading: false, error: action.payload }
        case CLOVER_RESET:
            return { loading: false }
        default:
            return state
    }
}
import React, { createContext, useReducer, useEffect, useContext } from 'react'
import { UserContext, UserContextUpdate } from './UserContext'

export const CartContext = createContext()
export const CartContextUpdate = createContext()



const initialState = { cartItems: [], shippingInfo: {}, shippingMethod: {}, discount: {} }

const cartReducer = (state, action) => {
    console.log(action)
    let newCartItems
    switch (action.type) {
        case "ADD_ITEM":
            newCartItems = state.cartItems.filter(item => item.cloverID !== action.cartItem.cloverID)
            newCartItems.push(action.cartItem)
            return { ...state, cartItems: newCartItems, shippingMethod: {}, discount: {} };
        case "QTY_ITEM":
            newCartItems = state.cartItems.map(item => {
                if (item.cloverID == action.cartItem.cloverID) return action.cartItem
                else return item
            })
            return { ...state, cartItems: newCartItems, shippingMethod: {}, discount: {} };
        case "REMOVE_ITEM":
            newCartItems = state.cartItems.filter(item => item.cloverID !== action.cloverID)
            return { ...state, cartItems: newCartItems, shippingMethod: {}, discount: {} };

        case "RESET_CART":
            return initialState;
        case "LOAD_USER_CART":
            return { ...state, cartItems: action.userCartItems };
        case "LOAD_URL_CART":
            return { ...state, cartItems: action.urlCartItems };

        case "ADD_SHIPPING":
            return { ...state, shippingInfo: action.shippingInfo };
        case "ADD_SHIPPING_METHOD":
            return { ...state, shippingMethod: action.shippingMethod };
        case "CLEAR_SHIPPING_METHOD":
            return { ...state, shippingMethod: {} };
        case "ADD_DISCOUNT":
            return { ...state, discount: action.discount };
        default:
            return state;
    }
}

export const CartContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState, () => {
        const localData = localStorage.getItem("cart")
        return localData ? JSON.parse(localData) : initialState
    })

    const user = useContext(UserContext)
    const userUpdate = useContext(UserContextUpdate)

    // User Login
    useEffect(() => {
        if (user._id) { dispatch({ type: "LOAD_USER_CART", userCartItems: user.cartItems }) }
    }, [user._id])

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state))
        console.log(state)
        if (user._id) userUpdate({ type: "CART", cartItems: state.cartItems })
    }, [state])



    return (
        <CartContext.Provider value={state}>
            <CartContextUpdate.Provider value={dispatch}>
                {children}
            </CartContextUpdate.Provider>
        </CartContext.Provider>
    )
}




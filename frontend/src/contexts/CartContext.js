import React, { createContext, useReducer, useEffect } from 'react'

export const CartContext = createContext()
export const CartContextUpdate = createContext()

const cartReducer = (state, action) => {
    console.log(action)
    switch (action.type) {
        case "LOGIN":
            return action.payload;
        case "LOGOUT":
            return {};
        case "UPDATE":
            return action.payload;
        default:
            return state;
    }
}

export const CartContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {}, () => {
        const localData = localStorage.getItem("cart")
        return localData ? JSON.parse(localData) : {}
    })

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state))
        console.log(state)
    }, [state])

    return (
        <CartContext.Provider value={state}>
            <CartContextUpdate.Provider value={dispatch}>
                {children}
            </CartContextUpdate.Provider>
        </CartContext.Provider>
    )
}



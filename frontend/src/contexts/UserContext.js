import axios from 'axios'
import React, { createContext, useReducer, useEffect } from 'react'

export const UserContext = createContext()
export const UserContextUpdate = createContext()

const userReducer = (state, action) => {
    console.log(action)
    switch (action.type) {
        case "LOGIN":
            return action.payload;
        case "UPDATE":
            return action.payload;
        case "LOGOUT":
            return {};

        case "CART":
            if (JSON.stringify(state.cartItems) !== JSON.stringify(action.cartItems)) {
                axios.put('/api/users/profile', { cartItems: action.cartItems }, {
                    headers: { Authorization: `Bearer ${state.token}` }
                }).then(data => console.log(data.data)).catch(e => console.log(e))
                return { ...state, cartItems: action.cartItems }
            } else return state

        default:
            return state;
    }
}

export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, {}, () => {
        const localData = localStorage.getItem("user")
        return localData ? JSON.parse(localData) : {}
    })

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state))
        console.log(state)
    }, [state])


    return (
        <UserContext.Provider value={state}>
            <UserContextUpdate.Provider value={dispatch}>
                {children}
            </UserContextUpdate.Provider>
        </UserContext.Provider>
    )
}
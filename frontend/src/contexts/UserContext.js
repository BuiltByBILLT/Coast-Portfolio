import React, { createContext, useReducer, useEffect } from 'react'

export const UserContext = createContext()
export const UserContextUpdate = createContext()

const userReducer = (state, action) => {
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
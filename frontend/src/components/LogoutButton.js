import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, NavDropdown } from 'react-bootstrap'
import { logout } from '../actions/userActions'


export const LogoutButton = ({ history }) => {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        history.push("/")
        dispatch(logout())
    }

    return (
        <NavDropdown.Item onClick={logoutHandler}>
            Log Out
        </NavDropdown.Item>
    )
}
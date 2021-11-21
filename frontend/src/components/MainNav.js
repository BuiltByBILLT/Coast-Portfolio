import React, { useContext } from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { UserContext, UserContextUpdate } from '../contexts/UserContext'

const MainNav = () => {

    const history = useHistory()
    const user = useContext(UserContext)
    const updateUser = useContext(UserContextUpdate)

    const { cartItems } = useSelector(state => state.cart)

    const logoutHandler = () => {
        updateUser({ type: "LOGOUT" })
        history.push('/')
    }

    return (
        <>
            <LinkContainer exact to='/'>
                <Nav.Link active={false} className='mx-2 mx-xl-4'>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/about'>
                <Nav.Link active={false} className='mx-2 mx-xl-4'>About</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/cart' style={{ minWidth: "100px" }}>
                <Nav.Link active={false} className='mx-2 mx-xl-4 text-center' >
                    <i className='fas fa-shopping-cart mx-1'></i>
                    Cart
                    {cartItems.length > 0 && (<span className='badge badge-warning' id='lblCartCount'>{cartItems.length}</span>)}
                </Nav.Link>
            </LinkContainer>
            {user._id ? (
                <NavDropdown title={user.firstName} id='username'
                    className='mx-2 mx-xl-4 my-3 my-lg-0'>
                    <LinkContainer to='/profile'>
                        <NavDropdown.Item active={false}>Profile</NavDropdown.Item>
                    </LinkContainer>
                    {user.isStaff
                        ? (<>
                            <LinkContainer to='/admin/userlist'>
                                <NavDropdown.Item active={false}>User List</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/orderlist'>
                                <NavDropdown.Item active={false}>Order List</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/productlist'>
                                <NavDropdown.Item active={false}>Product Page List</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/inventorylist'>
                                <NavDropdown.Item active={false}>Inventory List</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/categorylist'>
                                <NavDropdown.Item active={false}>Category List</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/brandlist'>
                                <NavDropdown.Item active={false}>Brand List</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/discountlist'>
                                <NavDropdown.Item active={false}>Discount List</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/reports'>
                                <NavDropdown.Item active={false}>Custom Reports</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/uploads'>
                                <NavDropdown.Item active={false}>File Uploads</NavDropdown.Item>
                            </LinkContainer>
                        </>)
                        : <LinkContainer to='/orderhistory'>
                            <NavDropdown.Item active={false}>Order History</NavDropdown.Item>
                        </LinkContainer>}
                    <NavDropdown.Item onClick={logoutHandler}>
                        Log Out
                    </NavDropdown.Item>
                </NavDropdown>
            ) : (
                <LinkContainer to='/login'>
                    <Nav.Link active={false} href="/login" className='loginButton px-4 ml-4 mb-3 mb-lg-0'>
                        Login
                    </Nav.Link>
                </LinkContainer>
            )}
        </>
    )
}

export default MainNav

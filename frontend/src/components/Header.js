import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown, Row, Image } from 'react-bootstrap'
import { logout } from '../actions/userActions'
import SearchBox from './SearchBox'
import SubNav from './SubNav'
import '../styles/Header.css'
import { LogoutButton } from './LogoutButton'

const Header = ({ history }) => {

    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { cartItems } = useSelector(state => state.cart)
    const { userInfo } = userLogin
    const logoutHandler = () => {
        // history.push("/")
        dispatch(logout())
    }

    return (
        <header>

            <Navbar bg="primary" variant='dark' expand="lg" collapseOnSelect className="px-1 px-md-2 px-lg-5">
                <LinkContainer to='/'>
                    <Navbar.Brand>
                        <Image src="/images/CA_Logo1.png"
                            style={{ width: "250px" }} />
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                />
                <Navbar.Collapse>

                    <Route render={({ history }) => <SearchBox history={history} />}></Route>

                    <Nav className='ml-auto'>
                        <LinkContainer exact to='/'>
                            <Nav.Link active={false} className='mx-2 mx-xl-4'>Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/about'>
                            <Nav.Link active={false} className='mx-2 mx-xl-4'>About</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/cart'>
                            <Nav.Link active={false} className='mx-2 mx-xl-4'>
                                <i className='fas fa-shopping-cart mx-1'></i>
                                Cart
                                {cartItems.length > 0 && (<span className='badge badge-warning' id='lblCartCount'>{cartItems.length}</span>)}
                            </Nav.Link>
                        </LinkContainer>
                        {userInfo ? (
                            <NavDropdown title={userInfo.name} id='username'
                                className='mx-2 mx-xl-4 my-3 my-lg-0'>
                                <LinkContainer to='/profile'>
                                    <NavDropdown.Item active={false}>Profile</NavDropdown.Item>
                                </LinkContainer>
                                {userInfo.isStaff
                                    ? (<>
                                        <LinkContainer to='/admin/orderlist'>
                                            <NavDropdown.Item active={false}>Order List</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to='/admin/productlist'>
                                            <NavDropdown.Item active={false}>Product List</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to='/admin/userlist'>
                                            <NavDropdown.Item active={false}>User List</NavDropdown.Item>
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
                                {/* <NavDropdown.Item onClick={logoutHandler}>
                                    Log Out
                                </NavDropdown.Item> */}
                                <Route render={({ history }) => <LogoutButton history={history} />}></Route>
                            </NavDropdown>
                        ) : (
                            <LinkContainer to='/login'>
                                <Nav.Link active={false} href="/login" className='loginButton px-4 ml-4 mb-3 mb-lg-0'>
                                    Login
                                </Nav.Link>
                            </LinkContainer>
                        )}
                    </Nav>

                    <Nav className='d-lg-none' style={{ backgroundColor: "#3e3e3e", margin: "1rem -40px -24px", padding: "0px 40px" }}>
                        <SubNav />  {/* Mobile */}
                    </Nav>
                </Navbar.Collapse >
            </Navbar >

            <div style={{ position: "", height: "7px", backgroundColor: "#b51320" }}></div>
            <Navbar variant='dark' expand="lg" collapseOnSelect className='py-0 py-lg-2'
                style={{ backgroundColor: "#3e3e3e" }}>
                <Navbar.Collapse>
                    <Nav className='mx-auto'>
                        <SubNav /> {/* Desktop */}
                    </Nav>
                </Navbar.Collapse >
            </Navbar >
        </header >
    )
}

export default Header

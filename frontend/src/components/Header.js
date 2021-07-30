import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown, Row } from 'react-bootstrap'
import { logout } from '../actions/userActions'
import SearchBox from './SearchBox'
import SubNav from './SubNav'
import '../styles/Header.css'

const Header = ({ }) => {

    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <header>
            <Navbar bg="primary" variant='dark' expand="lg" collapseOnSelect>
                <LinkContainer to='/'>
                    <Navbar.Brand>Coast Airbrush</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                />
                <Navbar.Collapse>
                    <Route render={({ history }) => <SearchBox history={history} />}></Route>
                    <Nav className='ml-auto'>
                        <LinkContainer exact to='/'>
                            <Nav.Link active={false} className='mx-4'>Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/about'>
                            <Nav.Link active={false} className='mx-4'>About</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/cart'>
                            <Nav.Link active={false} className='mx-4'>
                                <i className='fas fa-shopping-cart px-1'></i>
                                Cart
                            </Nav.Link>
                        </LinkContainer>
                        {userInfo ? (
                            <NavDropdown title={userInfo.name} id='username'
                                className=''>
                                <LinkContainer to='/profile'>
                                    <NavDropdown.Item active={false}>Profile</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/orderhistory'>
                                    <NavDropdown.Item active={false}>Order History</NavDropdown.Item>
                                </LinkContainer>
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
                    </Nav>
                    <Nav className='d-lg-none bg-danger'>
                        <SubNav />
                    </Nav>
                </Navbar.Collapse >
            </Navbar >
            <Navbar variant='dark' expand="lg" collapseOnSelect className='p-0 p-lg-1' style={{ backgroundColor: "maroon" }}>
                <Navbar.Collapse>
                    <Nav className='mx-auto'>
                        <SubNav />
                    </Nav>
                </Navbar.Collapse >
            </Navbar >
        </header >
    )
}

export default Header

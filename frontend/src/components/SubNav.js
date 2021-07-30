import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import '../styles/Header.css'

const SubNav = () => {



    return (
        <>
            <LinkContainer to='/category/0'>
                <Nav.Link active={false} className='mx-4'>Categories</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/bbb'>
                <Nav.Link active={false} className='mx-4'>Products</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/ccc'>
                <Nav.Link active={false} className='mx-4'>Brands</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/ddd'>
                <Nav.Link active={false} className='mx-4'>Coast TV</Nav.Link>
            </LinkContainer>
        </ >
    )
}

export default SubNav

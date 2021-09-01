import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import '../styles/Header.css'

const SubNav = () => {



    return (
        <>
            <LinkContainer to='/category/0' className=''>
                <Nav.Link active={false} className='mx-4'>Categories</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/products'>
                <Nav.Link active={false} className='mx-4'>Products</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/brands'>
                <Nav.Link active={false} className='mx-4'>Brands</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/youtube'>
                <Nav.Link active={false} className='mx-4'>Coast TV</Nav.Link>
            </LinkContainer>
        </ >
    )
}

export default SubNav

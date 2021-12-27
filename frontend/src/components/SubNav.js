import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import '../styles/Header.css'
import { Link } from 'react-router-dom'

const SubNav = () => {



    return (
        <>
            <LinkContainer to='/categories' className=''>
                <Nav.Link active={false} className='mx-4'>Categories</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/products'>
                <Nav.Link active={false} className='mx-4'>Products</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/brands'>
                <Nav.Link active={false} className='mx-4'>Brands</Nav.Link>
            </LinkContainer>
            <a href="http://www.coastairbrushtv.com/"
                className='nav-link mx-4'
                target='_blank'
            > Coast TV </a>
        </ >
    )
}

export default SubNav

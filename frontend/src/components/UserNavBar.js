import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'


export const UserNavBar = () => {
    return (
        <Navbar variant='light' expand="lg" collapseOnSelect className='pb-4 mb-5 pt-0'
            style={{
                borderStyle: "none none solid none",
                borderWidth: "1px",
            }}
        >
            <Nav className='mx-auto'>
                <LinkContainer to='/profile'>
                    <Nav.Link active={false} className='mx-2 mx-xl-4'>About</Nav.Link>
                </LinkContainer>
                <LinkContainer to='/orderhistory'>
                    <Nav.Link active={false} className='mx-2 mx-xl-4'>Order History</Nav.Link>
                </LinkContainer>
            </Nav>
        </Navbar >
    )
}

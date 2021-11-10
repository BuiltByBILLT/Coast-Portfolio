import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'


export const UserNavBar = () => {

    const { userInfo } = useSelector(state => state.userLogin)
    const isStaff = userInfo && userInfo.isStaff

    return (
        <Navbar variant='light' expand="lg" collapseOnSelect className='pb-4 mb-5 pt-0'
            style={{
                borderStyle: "none none solid none",
                borderWidth: "1px",
            }}
        >
            <Nav className='mx-auto'>
                <LinkContainer to='/wishlist'>
                    <Nav.Link active={false} className='mx-2 mx-xl-4'>Wish List</Nav.Link>
                </LinkContainer>
                <LinkContainer to='/profile'>
                    <Nav.Link active={false} className='mx-2 mx-xl-4'>About</Nav.Link>
                </LinkContainer>
                {isStaff
                    ? <LinkContainer to='/employeehistory'>
                        <Nav.Link active={false} className='mx-2 mx-xl-4'>Employee History</Nav.Link>
                    </LinkContainer>
                    : <LinkContainer to='/orderhistory'>
                        <Nav.Link active={false} className='mx-2 mx-xl-4'>Order History</Nav.Link>
                    </LinkContainer>}
            </Nav>
        </Navbar >
    )
}

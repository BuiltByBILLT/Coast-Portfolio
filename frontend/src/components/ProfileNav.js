import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, Col, Row } from 'react-bootstrap'
import '../styles/Header.css'

const ProfileNav = () => {


    return (
        <Navbar bg="white" variant='light' expand="lg" fill>
            {/* <Nav fill>
                <LinkContainer to='/aaa'>
                    <Nav.Link active={false} className='text-center'>Order History</Nav.Link>
                </LinkContainer>
                <LinkContainer to='/bbb'>
                    <Nav.Link active={false} className='text-center'>My Information</Nav.Link>
                </LinkContainer>
                <LinkContainer to='/ccc'>
                    <Nav.Link active={false} className='text-center'>Wish List</Nav.Link>
                </LinkContainer>
            </Nav> */}
            <Nav variant="pills" fill >

                <Nav.Link href="/home">Active</Nav.Link>


                <Nav.Link eventKey="link-1">Loooonger NavLink</Nav.Link>


                <Nav.Link eventKey="link-2">Link</Nav.Link>


                <Nav.Link eventKey="disabled" disabled>
                    Disabled
                </Nav.Link>

            </Nav>
        </Navbar>
    )
}

export default ProfileNav

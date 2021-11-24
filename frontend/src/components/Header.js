import React from 'react'
import { Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Image } from 'react-bootstrap'
import SearchBox from './SearchBox'
import MainNav from './MainNav'
import SubNav from './SubNav'
import '../styles/Header.css'

const Header = () => {

    return (
        <header>

            <Navbar bg="primary" variant='dark' expand="lg" collapseOnSelect className="px-1 px-md-2 px-lg-5">
                <LinkContainer to='/'>
                    <Navbar.Brand>
                        <Image src="/static/CA_Logo1.png"
                            style={{ width: "250px" }} />
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                />
                <Navbar.Collapse>

                    <Route render={({ history }) => <SearchBox history={history} />}></Route>

                    <Nav className='ml-auto'>
                        <MainNav />
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

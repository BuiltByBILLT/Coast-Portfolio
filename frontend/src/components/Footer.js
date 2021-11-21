import React from 'react'
import { Container, Row, Col, Nav, Navbar, Image } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import "../styles/Footer.css"

const Footer = () => {
    return (
        <footer >
            <Container>
                <Navbar variant='dark' expand="lg">
                    <Col lg={3} className="text-center text-lg-left">
                        <h6 className="pt-3 pb-0">POLICY</h6>
                        <Nav>
                            <LinkContainer to='/shippingpolicy'>
                                <Nav.Link active={false}>Shipping Policy</Nav.Link>
                            </LinkContainer>
                        </Nav>
                        <Nav>
                            <LinkContainer to='/returnpolicy'>
                                <Nav.Link active={false}>Return Policy</Nav.Link>
                            </LinkContainer>
                        </Nav>
                        <Nav>
                            <LinkContainer to='/international'>
                                <Nav.Link active={false}>International Orders</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Col>

                    <Col lg={3} className="text-center text-lg-left">
                        <h6 className="pt-3 pb-0">SHOP BY</h6>
                        <Nav>
                            <LinkContainer to='/category/0'>
                                <Nav.Link active={false}>Category</Nav.Link>
                            </LinkContainer>
                        </Nav>
                        <Nav>
                            <LinkContainer to='/products'>
                                <Nav.Link active={false}>Product</Nav.Link>
                            </LinkContainer>
                        </Nav>
                        <Nav>
                            <LinkContainer to='/brands'>
                                <Nav.Link active={false}>Brand</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Col>
                    <Col lg="auto" className="text-center text-lg-left">
                        {/* <h6 className="brand mr-lg-3">COAST AIRBRUSH</h6> */}
                        <Image src="/images/CA_Logo2.png"
                            style={{ height: "24px", marginBottom: "8px" }}
                        />
                        <Nav>
                            <LinkContainer exact to='/'>
                                <Nav.Link active={false}>Home</Nav.Link>
                            </LinkContainer>
                        </Nav>
                        <Nav>
                            <LinkContainer to='/about'>
                                <Nav.Link active={false}>About</Nav.Link>
                            </LinkContainer>
                        </Nav>
                        <Nav>
                            <LinkContainer to='/contact'>
                                <Nav.Link active={false}>Contact Us</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Col>
                    <Col className="text-center text-lg-left px-0 mt-4 mt-lg-auto ml-xl-5">
                        <Row className="mx-0 mb-4 mb-lg-2 mr-xl-5">
                            <Col className="px-1">
                                <i className="fab fa-facebook-square fa-2x text-white"></i>
                            </Col>
                            <Col className="px-1">
                                <i className="fab fa-youtube fa-2x text-white"></i>
                            </Col>
                            <Col className="px-1">
                                <i className="fab fa-twitter fa-2x text-white"></i>
                            </Col>
                            <Col className="px-1">
                                <i className="fab fa-pinterest fa-2x text-white"></i>
                            </Col>
                            <Col className="px-1">
                                <i className="fab fa-instagram fa-2x text-white"></i>
                            </Col>
                        </Row>
                        <p>&copy;2021 - Coast Airbrush | All rights reserved</p>
                        <p>Designed by Sprinkles Media | Build by BILLT</p>
                    </Col>
                </Navbar>
            </Container>
        </footer >
    )
}

export default Footer

import React, { useState } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingInfo, shippingInfoToClover } from '../actions/cartActions'
import { SideCart } from '../components/SideCart'


const ShippingScreen = ({ history, location }) => {
    const redirect = location.search ? location.search.split('=')[1] : '/'

    const { cartItems, shippingInfo } = useSelector(state => state.cart)
    const { userInfo } = useSelector(state => state.userLogin)
    if (cartItems.length == 0) {
        history.push('/cart')
    }

    const [email, setEmail] = useState(shippingInfo.email || (userInfo && userInfo.email) || "")
    const [news, setNews] = useState(shippingInfo.news || false)
    const [firstName, setFirstName] = useState(shippingInfo.firstName || "")
    const [lastName, setLastName] = useState(shippingInfo.lastName || "")
    const [company, setCompany] = useState(shippingInfo.company || "")
    const [address, setAddress] = useState(shippingInfo.address || "")
    const [address2, setAddress2] = useState(shippingInfo.address2 || "")
    const [city, setCity] = useState(shippingInfo.city || "")
    const [country, setCountry] = useState(shippingInfo.country || "")
    const [region, setRegion] = useState(shippingInfo.region || "")
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode || "")
    const [phone, setPhone] = useState(shippingInfo.phone || "")

    const dispatch = useDispatch()

    const submitHandler = async (e) => {
        e.preventDefault()
        dispatch(saveShippingInfo({ email, news, firstName, lastName, company, address, address2, city, country, region, postalCode, phone }))
        history.push('/shippingmethod')

        // dispatch(shippingInfoToClover())
    }

    return (
        <Container className="my-5 py-3">
            <h2 className="text-danger">Checkout</h2>
            <Row>
                <Col lg={6}>
                    <Row className="mt-4 mb-3">
                        <Col xs={12} lg className="order-2 order-lg-1">
                            <h5 className="">Contact Information</h5>
                        </Col>
                        <Col xs={12} lg="auto" className="text-right order-1 order-lg-2">
                            Already have an account?
                            <Link className="mx-2 text-danger" to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                                Sign In
                            </Link>
                        </Col>
                    </Row>

                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='email'>
                            <Form.Control type='text' placeholder='Email' value={email} required
                                onChange={(e) => setEmail(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Check id='news' type='checkbox' checked={news} label="Keep me up to date on news and offers"
                            onChange={(e) => setNews(e.target.checked)}>
                        </Form.Check>

                        <h5 className="mt-5">Shipping Address</h5>
                        <Row>
                            <Col className="pr-1">
                                <Form.Group controlId='firstName'>
                                    <Form.Control type='text' placeholder='First name' value={firstName} required
                                        onChange={(e) => setFirstName(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col className="pl-1">
                                <Form.Group controlId='lastName'>
                                    <Form.Control type='text' placeholder='Last name' value={lastName} required
                                        onChange={(e) => setLastName(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId='company'>
                            <Form.Control type='text' placeholder='Company (Optional)' value={company}
                                onChange={(e) => setCompany(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='address'>
                            <Form.Control type='text' placeholder='Address' value={address} required
                                onChange={(e) => setAddress(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='address2'>
                            <Form.Control type='text' placeholder='Apartment, Suite, Etc. (Optional)' value={address2}
                                onChange={(e) => setAddress2(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='city'>
                            <Form.Control type='text' placeholder='City' value={city} required
                                onChange={(e) => setCity(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Row>
                            <Col className="pr-1">
                                <Form.Group controlId='country'>
                                    <Form.Control type='text' placeholder='Country/Region' value={country} required
                                        onChange={(e) => setCountry(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col className="px-1">
                                <Form.Group controlId='region'>
                                    <Form.Control type='text' placeholder='State' value={region} required
                                        onChange={(e) => setRegion(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col className="pl-1">
                                <Form.Group controlId='postalCode'>
                                    <Form.Control type='text' placeholder='Postal code' value={postalCode} required
                                        onChange={(e) => setPostalCode(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId='phone'>
                            <Form.Control type='tel' placeholder='Phone (Optional)' value={phone}
                                onChange={(e) => setPhone(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Button type="submit">
                            Continue to Shipping
                        </Button>
                    </Form>

                </Col>
                <Col lg={6} className="pl-5 d-none d-lg-block">
                    <SideCart />
                </Col>
            </Row>

        </Container>
    )
}

export default ShippingScreen

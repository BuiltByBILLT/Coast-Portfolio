import React, { useContext, useEffect, useState } from 'react'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import axios from 'axios'
import { useMutation } from 'react-query'
import { Link } from 'react-router-dom'
import { SideCart } from '../components/SideCart'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { CartContext, CartContextUpdate } from '../contexts/CartContext'
import { UserContext } from '../contexts/UserContext'

const ShippingScreen = ({ history, location }) => {
    const redirect = location.search ? location.search.split('=')[1] : '/'

    const { cartItems, shippingInfo } = useContext(CartContext)
    const updateCart = useContext(CartContextUpdate)

    useEffect(() => {
        if (cartItems.length == 0) { history.push('/cart') }
    }, [cartItems])

    const emptyShipping = {
        email: "", news: false, firstName: "", lastName: "", company: "", address1: "", address2: "",
        city: "", region: "", country: "", postalCode: "", phone: ""
    }

    const [shipping, setShipping] = useState(Object.keys(shippingInfo).length != 0 ? shippingInfo : emptyShipping)
    const [verified, setVerified] = useState(false)

    const submitHandler = async () => {
        updateCart({
            type: "ADD_SHIPPING", shippingInfo: {
                ...shipping,
                address1: Array.isArray(data.data.XAVResponse.Candidate.AddressKeyFormat.AddressLine)
                    ? data.data.XAVResponse.Candidate.AddressKeyFormat.AddressLine[0]
                    : data.data.XAVResponse.Candidate.AddressKeyFormat.AddressLine,
                address2: Array.isArray(data.data.XAVResponse.Candidate.AddressKeyFormat.AddressLine)
                    ? data.data.XAVResponse.Candidate.AddressKeyFormat.AddressLine[1]
                    : "",
                city: data.data.XAVResponse.Candidate.AddressKeyFormat.PoliticalDivision2,
                region: data.data.XAVResponse.Candidate.AddressKeyFormat.PoliticalDivision1,
                country: data.data.XAVResponse.Candidate.AddressKeyFormat.CountryCode,
                postalCode: data.data.XAVResponse.Candidate.AddressKeyFormat.PostcodePrimaryLow,

            }
        })
        history.push('/shippingmethod')
    }


    const { data, error, isLoading, mutate } = useMutation(data => {
        return axios.post(`/api/shipping/ups/AV`, data)
    })

    const verifyHandler = async (e) => {
        e.preventDefault()
        setVerified(true)
        mutate(shipping)
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

                    <Form onSubmit={verifyHandler}>
                        <Form.Group controlId='email'>
                            <Form.Control type='text' placeholder='Email' value={shipping.email} required
                                onChange={(e) => setShipping({ ...shipping, email: e.target.value })}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Check id='news' type='checkbox' checked={shipping.news} label="Keep me up to date on news and offers"
                            onChange={(e) => setShipping({ ...shipping, news: e.target.checked })}>
                        </Form.Check>

                        <h5 className="mt-5 mb-4">Shipping Address</h5>
                        {verified
                            ? (<>
                                {isLoading && <Loader />}
                                {error && <Message variant="danger">{JSON.stringify(error.response.data.message)}</Message>}
                                {data && (
                                    <div className="border px-3 my-3">
                                        <p className="mt-4">Is This Correct?</p>
                                        {/* <p>{JSON.stringify(data.data)}</p> */}
                                        {Array.isArray(data.data.XAVResponse.Candidate.AddressKeyFormat.AddressLine)
                                            ? (<>
                                                <h4> {data.data.XAVResponse.Candidate.AddressKeyFormat.AddressLine[0]}</h4>
                                                <h4>{data.data.XAVResponse.Candidate.AddressKeyFormat.AddressLine[1]}</h4>
                                            </>)
                                            : <h4> {data.data.XAVResponse.Candidate.AddressKeyFormat.AddressLine}</h4>
                                        }
                                        <h4>{data.data.XAVResponse.Candidate.AddressKeyFormat.Region}, {data.data.XAVResponse.Candidate.AddressKeyFormat.CountryCode} </h4>
                                        <br />
                                    </div>)}
                            </>)
                            : (<>
                                <Row>
                                    <Col className="pr-1">
                                        <Form.Group controlId='firstName'>
                                            <Form.Control type='text' placeholder='First name' value={shipping.firstName} required
                                                onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col className="pl-1">
                                        <Form.Group controlId='lastName'>
                                            <Form.Control type='text' placeholder='Last name' value={shipping.lastName} required
                                                onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group controlId='company'>
                                    <Form.Control type='text' placeholder='Company (Optional)' value={shipping.company}
                                        onChange={(e) => setShipping({ ...shipping, company: e.target.value })}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='address'>
                                    <Form.Control type='text' placeholder='Address' value={shipping.address1} required
                                        onChange={(e) => setShipping({ ...shipping, address1: e.target.value })}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='address2'>
                                    <Form.Control type='text' placeholder='Apartment, Suite, Etc. (Optional)' value={shipping.address2}
                                        onChange={(e) => setShipping({ ...shipping, address2: e.target.value })}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='city'>
                                    <Form.Control type='text' placeholder='City' value={shipping.city} required
                                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}>
                                    </Form.Control>
                                </Form.Group>
                                <Row>
                                    <Col className="pr-1">
                                        <Form.Group controlId='country'>
                                            <Form.Control type='text' placeholder='Country/Region' value={shipping.country} required
                                                onChange={(e) => setShipping({ ...shipping, country: e.target.value })}>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col className="px-1">
                                        <Form.Group controlId='region'>
                                            <Form.Control type='text' placeholder='State' value={shipping.region} required
                                                onChange={(e) => setShipping({ ...shipping, region: e.target.value })}>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col className="pl-1">
                                        <Form.Group controlId='postalCode'>
                                            <Form.Control type='text' placeholder='Postal code' value={shipping.postalCode} required
                                                onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group controlId='phone'>
                                    <Form.Control type='tel' placeholder='Phone' value={shipping.phone} required
                                        onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}>
                                    </Form.Control>
                                </Form.Group>
                            </>)}
                        {!verified && <Button type="submit" disabled={verified && error} className="mt-2">
                            Verify and Continue
                        </Button>}
                        {verified && <Button type="button" className="mt-2"
                            onClick={() => submitHandler()}
                        >Accept and Continue</Button>}
                        {verified && <Button type="button" variant="secondary" className="mx-2 mt-2"
                            onClick={() => setVerified(false)}
                        >Go Back & Edit</Button>}
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

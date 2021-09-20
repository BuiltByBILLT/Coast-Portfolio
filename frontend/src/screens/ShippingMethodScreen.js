import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, ListGroup, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingInfo, saveShippingMethod } from '../actions/cartActions'
import { SideCart } from '../components/SideCart'


const ShippingMethodScreen = ({ history, location }) => {
    const redirect = location.search ? location.search.split('=')[1] : '/'

    const { cartItems, shippingInfo, shippingMethod } = useSelector(state => state.cart)
    if (shippingInfo && Object.keys(shippingInfo).length == 0) {
        history.push('/shipping')
    }

    const subtotal = cartItems.reduce((acc, curr) => acc + curr.qty * curr.price, 0)
    const [methods, setMethods] = useState([])
    const [selected, setSelected] = useState(shippingMethod)

    var items = cartItems.reduce((acc, curr) => acc + Number(curr.qty), 0)
    let samplePrices = [
        { method: "USPS (Standard)", price: subtotal < 10000 ? 900 : subtotal * 0.09 },
        { method: "UPS (Standard)", price: subtotal < 10000 ? 900 : subtotal * 0.09 },
    ]

    useEffect(() => {
        setMethods(samplePrices)

    }, [subtotal])

    const dispatch = useDispatch()

    const radioHandler = (e) => {
        setSelected(methods[e.target.value])
    }
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingMethod(selected))
        history.push('/payment')
    }

    return (
        <Container className="my-5 py-3">
            <Row>
                <Col lg={6}>
                    {/* <h5 className="">Shipping Information</h5> */}
                    <ListGroup>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    <strong>Contact:</strong> {shippingInfo.email}
                                </Col>
                                <Col xs="auto" className="text-right">
                                    <Link to="/shipping" className="text-muted">Change</Link>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    <strong>Ship to: </strong>
                                    <br /> {shippingInfo.address} {shippingInfo.address2}
                                    <br />{shippingInfo.city}, {shippingInfo.region}, {shippingInfo.country}, {shippingInfo.postalCode}
                                </Col>
                                <Col xs="auto" className="text-right">
                                    <Link to="/shipping" className="text-muted">Change</Link>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    </ListGroup>

                    <h5 className="mt-5">Shipping Method</h5>
                    <p>(Items: {items})</p>
                    <Form onSubmit={submitHandler}>
                        <ListGroup>
                            {methods.map((method, index) => (
                                <ListGroup.Item key={index}>
                                    <Row >
                                        <Col>
                                            <Form.Check type="radio" name="method" id="standard" value={index} label={method.method}
                                                defaultChecked={method.method == selected.method}
                                                onChange={radioHandler} />
                                        </Col>
                                        <Col xs="auto" className="text-right">
                                            {Number(method.price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <Button className="mt-5" type="submit"
                            disabled={!selected.method}>
                            Continue to Checkout
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

export default ShippingMethodScreen

import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Row, Col, ListGroup, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingInfo, saveShippingMethod } from '../actions/cartActions'
import { SideCart } from '../components/SideCart'
import { CartContext, CartContextUpdate } from '../contexts/CartContext'


const ShippingMethodScreen = ({ history, location }) => {

    const { cartItems, shippingInfo, shippingMethod } = useContext(CartContext)
    const updateCart = useContext(CartContextUpdate)

    useEffect(() => {
        if (Object.keys(shippingInfo).length == 0) history.push('/shipping')
    }, [shippingInfo])

    const emptyMethod = { method: "", price: 0 }
    const subtotal = cartItems.reduce((acc, curr) => acc + curr.qty * curr.price, 0)
    const fixedMethods = [
        { method: "UPS Ground", price: subtotal < 10000 ? 900 : subtotal * 0.09, disabled: false },
        { method: "USPS (Coming Soon)", price: subtotal < 10000 ? 900 : subtotal * 0.09, disabled: true },
    ]

    const [methods, setMethods] = useState(fixedMethods)
    const [selected, setSelected] = useState(Object.keys(shippingMethod).length != 0 ? shippingMethod : emptyMethod)

    console.log(selected)

    const radioHandler = (e) => {
        setSelected(methods[e.target.value])
    }
    const submitHandler = (e) => {
        e.preventDefault()
        updateCart({ type: "ADD_SHIPPING_METHOD", shippingMethod: fixedMethods[0] })
        history.push('/payment')
    }

    return (
        <Container className="my-5 py-3">
            <Row>
                <Col lg={6}>
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
                                    <br /> {shippingInfo.address1}
                                    {shippingInfo.address2 && <><br /> {shippingInfo.address2}</>}
                                    <br />{shippingInfo.city}, {shippingInfo.region}, {shippingInfo.country}, {shippingInfo.postalCode}
                                </Col>
                                <Col xs="auto" className="text-right">
                                    <Link to="/shipping" className="text-muted">Change</Link>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    </ListGroup>

                    <h5 className="mt-5">Shipping Method</h5>
                    <Form onSubmit={submitHandler}>
                        <ListGroup>
                            {methods.map((method, index) => (
                                <ListGroup.Item key={index}>
                                    <Row >
                                        <Col>
                                            <Form.Check type="radio" name="method" id="standard" value={index} label={method.method}
                                                defaultChecked={method.method == selected.method} disabled={method.disabled}
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

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'

const PlaceOrderScreen = () => {
    const cart = useSelector(state => state.cart)

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    // Calculate Prices
    cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 10
    cart.taxPrice = 0.15 * cart.itemsPrice
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice



    const placeOrderHandler = () => {

    }
    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col lg={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}
                                , {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0
                                ? <Message>Your cart is empty</Message>
                                : (
                                    <ListGroup variant='flush'>
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col lg={1}>
                                                        <Image src={item.image} alt={item.name}
                                                            fluid rounded />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col lg={4}>
                                                        {item.qty} x ${item.price} = ${item.qty * item.price}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col lg={4}>
                    <Card>
                        <ListGroup>
                            <ListGroup.Item>
                                <h2>Order Summart</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>{formatter.format(cart.itemsPrice)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>{formatter.format(cart.shippingPrice)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>{formatter.format(cart.taxPrice)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>{formatter.format(cart.totalPrice)}</Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                        <ListGroup.Item className=''>
                            <Button type='button' diabled={cart.cartItems === 0}
                                onClick={placeOrderHandler}>
                                Place Order
                            </Button>
                        </ListGroup.Item>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default PlaceOrderScreen

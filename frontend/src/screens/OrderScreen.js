import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {
    const orderId = match.params.id

    const { order, loading, error } = useSelector(state => state.orderDetails)
    const { userInfo } = useSelector(state => state.userLogin)


    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getOrderDetails(orderId))
        return () => { }
    }, [])


    return (
        <Container className="my-5">
            {loading ? <Loader />
                : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <>
                            <Row className="mt-5 mb-3">
                                <Col lg="auto">
                                    <h3 className="text-danger text-break m-0">Order #{orderId}</h3>
                                </Col>
                                <Col className="mt-3 mt-lg-auto">
                                    <p className="my-0">{Date(order.createdTime).toLocaleString().substr(4, 11)}</p>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg={9}>
                                    {order.lineItems &&
                                        (
                                            <ListGroup className="mb-5">
                                                <ListGroup.Item className="mb-3 border-left-0 border-right-0 px-0">
                                                    <Row>
                                                        <Col xs={4} lg={3} className="mb-3 mb-lg-0 my-auto d-none d-lg-block">
                                                            <h6>Product</h6>
                                                        </Col>
                                                        <Col className="d-none d-lg-block my-auto">
                                                        </Col>
                                                        <Col xs={5} lg={2} className="text-center my-auto">
                                                            <h6>Price</h6>
                                                        </Col>
                                                        <Col xs={2} lg={1} className="text-center my-auto">
                                                            <h6>Qty</h6>
                                                        </Col>
                                                        <Col xs={5} lg={2} className="text-center my-auto">
                                                            <h6>Total</h6>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>

                                                {order.lineItems.map((item, index) => (
                                                    <ListGroup.Item key={index} className="mb-3 border-0 px-0">
                                                        <Row>
                                                            <Col xs={12} lg={3} className="mb-3 mb-lg-0">
                                                                {item.image &&
                                                                    <Image src={"https://www.coastairbrush.com/" + item.image} alt={item.name}
                                                                        fluid rounded />}
                                                            </Col>
                                                            <Col xs={12} lg={4} className="mb-2 my-lg-auto text-center text-lg-left">
                                                                {item.name === "Website Shipping"
                                                                    ? item.alternateName
                                                                    : <Link to={`/product/${item.pID}`}
                                                                        className=" text-danger" style={{ fontWeight: "bold" }}>
                                                                        {item.name}
                                                                    </Link>}
                                                            </Col>
                                                            <Col xs={5} lg={2} className="text-center my-auto">
                                                                {Number(item.price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                                            </Col>
                                                            <Col xs={2} lg={1} className="text-center my-auto border">
                                                                {item.qty}
                                                            </Col>
                                                            <Col xs={5} lg={2} className="text-center my-auto">
                                                                {Number(item.qty * item.price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        )}
                                    {order.payment && (<ListGroup>
                                        <ListGroup.Item>
                                            <h4>Payment</h4>
                                            <p>Status: {order.payment === "OPEN" ? "NOT PAID" : order.payment}</p>


                                        </ListGroup.Item>
                                    </ListGroup>)}
                                    {order.shippingLabel && (<ListGroup>
                                        <ListGroup.Item>
                                            <h4>Shipping</h4>
                                            <p>
                                                {/* <strong>Name: </strong>{order.user.name} */}
                                            </p>
                                            <p>
                                                <strong>Email: </strong>
                                                <a href={`mailto:${order.shippingLabel.email}`}>{order.shippingLabel.email}</a>
                                            </p>
                                            <p>
                                                <strong>Address: </strong>
                                                {order.shippingLabel.address} {order.shippingLabel.address2}, {order.shippingLabel.city},
                                                {order.shippingLabel.region}, {order.shippingLabel.country}, {order.shippingLabel.postalCode}
                                            </p>
                                            {order.shippingLabel.phone &&
                                                (<p>
                                                    <strong>Phone: </strong>
                                                    {order.shippingLabel.phone}
                                                </p>)}
                                            {/* {order.isDelivered
                                        ? <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                                        : <Message variant='danger'>Not Delivered</Message>
                                    } */}
                                        </ListGroup.Item>
                                    </ListGroup>)}

                                </Col>
                                {/* <Col lg={3} className="pl-lg-5">
                            <Card>
                            <ListGroup>
                            <ListGroup.Item>
                            <h4>Order Summary</h4>
                            </ListGroup.Item>
                            <ListGroup.Item>
                            <Row>
                            <Col>Items</Col>
                            <Col>{order.itemsPrice}</Col>
                            </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                            <Row>
                            <Col>Shipping</Col>
                            <Col>{order.shippingPrice}</Col>
                            </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                            <Row>
                            <Col>Tax</Col>
                            <Col>{order.taxPrice}</Col>
                            </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                            <Row>
                            <Col>Total</Col>
                            <Col>{order.totalPrice}</Col>
                            </Row>
                            </ListGroup.Item>
                            {userInfo && userInfo.isAdmin && !order.isDelivered && (
                                <ListGroup.Item>
                                <Button type='button' className='btn btn-block'
                                onClick={deliverHandler}
                                disabled={!order.isPaid}
                                >
                                Mark as Delivered
                                </Button>
                                </ListGroup.Item>
                                )}
                                </ListGroup>
                                </Card>
                            </Col> */}
                            </Row>
                        </>
                    )
            }
        </Container>
    )

}

export default OrderScreen

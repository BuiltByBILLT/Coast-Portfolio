import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Form, Button, Row, Col, Image, ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listMyOrders } from '../actions/orderActions'

const OrderHistoryScreen = ({ history }) => {


    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const orderListMy = useSelector(state => state.orderListMy)
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

    const dispatch = useDispatch()
    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            dispatch(listMyOrders())
        }
        return () => { }
    }, [history, userInfo])



    return (
        <div>
            <h2 className="text-center my-3">My Orders</h2>
            {loadingOrders ? <Loader />
                : errorOrders ? <Message variant='danger'>{errorOrders}</Message>
                    : orders && orders.length ? (
                        <ListGroup >
                            {orders.map(order => (
                                <ListGroup.Item key={order._id} className="border-0 mb-3">
                                    <Row className="justify-content-center">
                                        <Col lg={4}>
                                            <Image src={order.orderItems[0].image} alt={order.orderItems[0].name}
                                                fluid rounded />
                                        </Col>
                                        <Col lg={4} className="my-auto">
                                            <Row className="justify-content-center mt-3">
                                                <h4 className="text-danger" style={{ letterSpacing: "0px" }}>
                                                    ${order.totalPrice}
                                                </h4>
                                            </Row>
                                            <Row className="justify-content-center">
                                                <p>
                                                    {order.createdAt.substring(0, 10)}
                                                </p>
                                            </Row>
                                            <Row className="justify-content-center">
                                                <LinkContainer to={`/order/${order._id}`}>
                                                    <Button className='btn-sm' variant='dark'>View Details</Button>
                                                </LinkContainer>
                                            </Row>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))
                            }
                        </ListGroup>
                    ) : (
                        <div className="my-5">
                            <Message variant="success" >No Orders Yet</Message>
                        </div>
                    )


            }
        </div >
    )
}

export default OrderHistoryScreen

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Form, Button, Row, Col, Image, ListGroup, Container, Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listMyOrders } from '../actions/orderActions'
import { UserNavBar } from '../components/UserNavBar'
import { envImage } from '../common'

const OrderHistoryScreen = ({ history }) => {

    const { userInfo } = useSelector(state => state.userLogin)
    const { loading, error, orders } = useSelector(state => state.orderListMy)

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
        <Container className="my-5">
            <UserNavBar></UserNavBar>
            {loading ? <Loader />
                : error ? <Message variant='danger'>{error}</Message>
                    : orders && orders.length ? (
                        <ListGroup >
                            {orders.map(order => (
                                <ListGroup.Item key={order.id} className="border-0 mb-3">
                                    <Row className="justify-content-center">
                                        <Col lg={4} className="text-center">
                                            {order.orderImage &&
                                                <Image src={envImage(order.orderImage)}
                                                    alt={order.lineItems.elements[0].name} fluid rounded
                                                    style={{ height: "200px" }}
                                                />}
                                        </Col>
                                        <Col lg={4} className="my-auto">
                                            <Row className="justify-content-center mt-3">
                                                <h4 className="text-danger" style={{ letterSpacing: "0px" }}>
                                                    {Number(order.total / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                                </h4>
                                            </Row>
                                            <Row className="justify-content-center">
                                                <p>
                                                    {Date(order.createdTime).substring(4, 24)}
                                                </p>
                                            </Row>
                                            <Row className="justify-content-center">
                                                <LinkContainer to={`/order/${order.id}`}>
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
        </Container >
    )
}

export default OrderHistoryScreen

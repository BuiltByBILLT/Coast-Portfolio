import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Form, Button, Row, Col, Image, ListGroup, Container, Navbar, Nav, useAccordionToggle } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listMyOrders } from '../actions/orderActions'
import { UserNavBar } from '../components/UserNavBar'
import { useQuery } from 'react-query'
import axios from 'axios'
import { envImage } from '../common'

const EmployeeHistoryScreen = ({ history }) => {

    const { userInfo } = useSelector(state => state.userLogin)
    // const { loading, error, orders } = useSelector(state => state.orderListMy)

    const { isLoading, isError, data, error } = useQuery('employeeHistory', () =>
        axios.get(`/api/orders/employee`,
            { headers: { Authorization: `Bearer ${userInfo.token}` } }))
    const orders = data && data.data

    // const dispatch = useDispatch()
    useEffect(() => {
        if (userInfo) {
            // dispatch(listMyOrders())
            if (!userInfo.isStaff) history.push('/')

        } else {
            history.push('/login')
        }
        return () => { }
    }, [history, userInfo])



    return (
        <Container className="my-5">
            {/* <p>{JSON.stringify(data && data.data)}</p> */}
            {/* <p>{JSON.stringify(orders)}</p> */}
            <UserNavBar></UserNavBar>
            {isLoading ? <Loader />
                : isError ? <Message variant='danger'>{error}</Message>
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
                                                    {new Date(order.createdTime).toLocaleString()}
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

export default EmployeeHistoryScreen

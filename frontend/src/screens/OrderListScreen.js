import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listOrders } from '../actions/orderActions'

const OrderListScreen = ({ history, match }) => {

    const dispatch = useDispatch()

    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders } = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (userInfo && userInfo.isStaff) {
            dispatch(listOrders())
        } else {
            history.push('/login')
        }

        return () => { }
    }, [dispatch, history, userInfo])

    return (
        <Container className="my-5 py-3">
            <Row className='align-items-center'>
                <Col>
                    <h1>ORDERS</h1>
                </Col>
            </Row>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                : (
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                {/* <th>USER</th> */}
                                <th>DATE</th>
                                <th>TOTAL</th>
                                {/* <th>PAID</th> */}
                                {/* <th>DELIVERED</th> */}
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    {/* <td>{order.user && order.user.name}</td> */}
                                    <td>{Date(order.createdTime).substring(4, 24)}</td>
                                    <td>{Number(order.total / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                                    {/* <td>{order.isPaid ? (
                                        order.paidAt.substring(0, 10)
                                    ) : (
                                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                                    )}
                                    </td>
                                    <td>{order.isDelivered ? (
                                        order.deliveredAt.substring(0, 10)
                                    ) : (
                                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                                    )}
                                    </td> */}
                                    <td>
                                        <LinkContainer to={`/order/${order.id}`}>
                                            <Button variant='light' className='btn-sm'>
                                                Details
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
        </Container>
    )
}

export default OrderListScreen

import React, { useContext, useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Container, Form, InputGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listOrders } from '../actions/orderActions'
import { UserContext } from '../contexts/UserContext'

const OrderListScreen = ({ history, match }) => {

    const [search, setSearch] = useState("")

    const dispatch = useDispatch()

    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders } = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const user = useContext(UserContext)

    useEffect(() => {
        // if (userInfo && userInfo.isStaff) {
        dispatch(listOrders(user.token))
        // } else {
        //     history.push('/login')
        // }

        return () => { }
    }, [dispatch, history, userInfo])

    const searchHandler = (e) => {
        e.preventDefault()
        alert(search)
        // dispatch()
    }
    const printHandler = (e) => {
        history.push('/admin/unshipped')
    }

    return (
        <Container className="my-5 py-3">
            <Row className='align-items-center'>
                <Col>
                    <h1>ORDERS</h1>
                </Col>
                <Col className="my-auto mr-4">
                    <Form onSubmit={searchHandler}>
                        <InputGroup>
                            <Form.Control
                                placeholder="Search by Order ID"
                                aria-label="Search by Order ID"
                                style={{ height: "50px" }}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <InputGroup.Append>
                                <Button variant="primary" onClick={searchHandler}>
                                    <i className="fas fa-search"></i>
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </Col>
                <Col className="text-right" xs="auto">
                    <Button variant="danger" className='my-3' onClick={printHandler}>
                        Bulk Print Unshipped
                    </Button>
                </Col>
            </Row>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                : (
                    <Table striped bordered hover responsive className='table-sm mt-3'>
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
                                    <td>{new Date(order.createdTime).toString().substring(4, 24)}</td>
                                    {/* <td>{order.createdTime}</td> */}
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

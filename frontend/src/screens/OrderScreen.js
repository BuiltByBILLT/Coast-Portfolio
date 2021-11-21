import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useMutation, useQuery } from 'react-query'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button, Container, Nav, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, deliverOrder } from '../actions/orderActions'
// import { createUPS } from '../actions/shippingActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {
    const orderID = match.params.id


    const [size, setSize] = useState("")
    const [amount, setAmount] = useState("")
    const [lineID, setLineID] = useState("")

    const { order, loading, error } = useSelector(state => state.orderDetails)
    const { userInfo } = useSelector(state => state.userLogin)


    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getOrderDetails(orderID))
        return () => { }
    }, [])

    // Check if Label already created
    const { isLoading, isError, data: labelData, error: labelError, refetch } = useQuery('label', () =>
        axios.get(`/api/shipping/tracking/${orderID}`)
    )

    // Shipping Label Mutations
    const labelMutation = useMutation(data => {
        return axios.post(`/api/shipping/ups/${orderID}/${size}`, data,
            { headers: { Authorization: `Bearer ${userInfo.token}` } })
    })
    const handleUPS = () => {
        labelMutation.mutate(order.shippingLabel)
    }

    // Refund Mutation
    const refundMutation = useMutation(data => {
        return axios.post(`/api/clover/refund`, data,
            { headers: { Authorization: `Bearer ${userInfo.token}` } })
    })
    const handleRefund = () => {
        refundMutation.mutate({ amount, lineID, orderID })
    }

    useEffect(() => {
        if (labelMutation.data) { refetch() }
        if (refundMutation.data) {
            dispatch(getOrderDetails(orderID))
            setAmount("")
            setLineID("")
        }
    }, [labelMutation.isSuccess, refundMutation.isSuccess])

    return (
        <Container className="my-5">
            {loading ? <Loader />
                : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <>
                            <Row className="mt-5 mb-3">
                                <Col lg="auto">
                                    <h3 className="text-danger text-break m-0">Order #{orderID}</h3>
                                </Col>
                                <Col className="mt-3 mt-lg-auto">
                                    <p className="my-0">{Date(order.createdTime).toLocaleString().substr(4, 11)}</p>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg={12} xl={10}>
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
                                            <h4 className="mb-3">Payment</h4>
                                            {order.payment.state === "PAID" ? (
                                                <>
                                                    {
                                                        order.payment.discounts &&
                                                        <p><strong>Discount: </strong>{(order.payment.discounts.elements[0].amount / 100)
                                                            .toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                                                    }
                                                    <p><strong>Tax: </strong>{(order.payment.tax / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                                                    <p><strong>Total: </strong>{(order.payment.total / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                                                </>
                                            ) : <p><strong>Status: </strong>{order.payment.state === "OPEN" ? "NOT PAID / PROCESSING" : "PAID"}</p>
                                            }
                                            {order.employee && (
                                                <p>
                                                    <strong>Employee: </strong>
                                                    <a>{order.employee}</a>
                                                </p>
                                            )}


                                        </ListGroup.Item>
                                    </ListGroup>)}

                                    {(<ListGroup>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col >
                                                    <h4 className="mb-3">Refunds</h4>
                                                    {order.refunds && order.refunds.map(refund => (
                                                        <>
                                                            <p>
                                                                <strong>{new Date(refund.createdTime).toLocaleString()}: </strong>
                                                                {Number(refund.amount / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                                            </p>
                                                            <p>{ }</p>
                                                        </>
                                                    ))
                                                    }
                                                </Col>

                                                {userInfo && userInfo.isStaff &&
                                                    <Col className="text-center">
                                                        <Row>
                                                            <Col>
                                                                <Form.Control as="select"
                                                                    value={lineID}
                                                                    onChange={(e) => setLineID(e.target.value)}
                                                                >
                                                                    <option value="">Select Item</option>

                                                                    {order.lineItems && order.lineItems.map(item => (
                                                                        <option value={item.id}>{item.name}</option>
                                                                    ))}
                                                                </Form.Control>
                                                            </Col>
                                                        </Row>
                                                        <Row noGutters>
                                                            <Col>
                                                                <Form.Control type="number" value={amount} placeholder="Refund Amount (Cents)"
                                                                    onChange={(e) => setAmount(e.target.value)}
                                                                >
                                                                </Form.Control>
                                                            </Col>
                                                            <Col xs="auto">
                                                                <Button
                                                                    disabled={!lineID || !amount || refundMutation.isLoading}
                                                                    block style={{ height: "47px" }}
                                                                    onClick={handleRefund}
                                                                >
                                                                    {refundMutation.isLoading ? "Loading" : "Refund"}
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                        <p className="text-danger">{refundMutation.error && "Error"}</p>
                                                        <p className="text-danger">{refundMutation.error && JSON.parse(refundMutation.error.response.data.message).error.message}</p>
                                                    </Col>
                                                }

                                            </Row>
                                        </ListGroup.Item>
                                    </ListGroup>)}

                                    {order.shippingLabel && (<ListGroup className="mb-4">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>
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
                                                    {labelData && labelData.data.tracking &&
                                                        (<p>
                                                            <strong>Tracking Number: </strong>
                                                            {labelData.data.tracking}
                                                        </p>)}
                                                </Col>

                                                {userInfo && userInfo.isStaff &&
                                                    <Col className="text-center">
                                                        {labelData && labelData.data.tracking
                                                            ? <a href={`data:image/png;base64,${labelData.data.raw}`} target="_self" type="image/png">Right Click to Open Label</a>
                                                            : (<>
                                                                <Form.Control type="number" value={size} placeholder="Weight in lbs"
                                                                    onChange={(e) => setSize(e.target.value)}
                                                                >

                                                                </Form.Control>
                                                                <Button
                                                                    disabled={labelMutation.isLoading || labelMutation.isSuccess || size === ""}
                                                                    block
                                                                    onClick={handleUPS}>
                                                                    {labelMutation.isLoading ? "Loading" : "Create UPS Label"}
                                                                </Button>
                                                                <p className="text-danger">{labelMutation.error && JSON.stringify(labelMutation.error)}</p>
                                                            </>)
                                                        }
                                                    </Col>
                                                }
                                            </Row>

                                        </ListGroup.Item>
                                    </ListGroup>)}

                                </Col>

                            </Row>
                        </>
                    )
            }
        </Container >
    )

}

export default OrderScreen

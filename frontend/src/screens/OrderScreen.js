import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button, Container, Nav, Form } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
// import { createUPS } from '../actions/shippingActions'
import { envImage } from '../common'
import { UserContext } from '../contexts/UserContext'

const OrderScreen = ({ match, history }) => {
    const orderID = match.params.id
    const user = useContext(UserContext)


    const [size, setSize] = useState("")
    const [amount, setAmount] = useState("")
    const [lineID, setLineID] = useState("")
    const [error, setError] = useState("")

    const { isLoading: loading, data, refetch } = useQuery(['orders', orderID], () => {
        return axios.get(`/api/orders/${orderID}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onError: ({ response, message }) => { setError(response?.data.message || message) },
    })
    const order = data?.data

    // Check if Label already created
    const { isLoading, isError, data: labelData, error: labelErrorrefetch, refetch: refetchLabel } = useQuery('label', () =>
        axios.get(`/api/shipping/tracking/${orderID}`)
    )

    // Shipping Label Mutations
    const labelMutation = useMutation(data => {
        return axios.post(`/api/shipping/ups/${orderID}/${size}`, data,
            { headers: { Authorization: `Bearer ${user.token}` } })
    })
    const handleUPS = () => {
        labelMutation.mutate(order.shippingLabel)
    }

    // Refund Mutation
    const refundMutation = useMutation(data => {
        return axios.post(`/api/clover/refund`, data,
            { headers: { Authorization: `Bearer ${user.token}` } })
    })
    const handleRefund = () => {
        refundMutation.mutate({ amount, lineID, orderID })
    }

    useEffect(() => {
        if (labelMutation.data) { refetchLabel() }
        if (refundMutation.data) {
            refetch()
            setAmount("")
            setLineID("")
        }
    }, [labelMutation.isSuccess, refundMutation.isSuccess])

    return (
        <Container className="my-5">
            {loading ? <Loader />
                : error ? <Message variant='danger'>{error.response && error.response.data.message
                    ? error.response.data.message : error.message}</Message>
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
                                                            {/* <Col xs={12} lg={3} className="mb-3 mb-lg-0">
                                                                {item.image &&
                                                                    <Image src={envImage(item.image)} alt={item.name}
                                                                        fluid rounded />}
                                                            </Col> */}
                                                            <Col xs={12} lg={7} className="mb-2 my-lg-auto text-center text-lg-left">
                                                                {item.name === "Website Shipping"
                                                                    ? item.alternateName
                                                                    : item.alternateName
                                                                        ? <Link to={`/product/${item.alternateName}`}
                                                                            className=" text-danger" style={{ fontWeight: "bold" }}>
                                                                            {item.name}
                                                                        </Link>
                                                                        : <p className=" text-danger" style={{ fontWeight: "bold" }}>
                                                                            {item.name}
                                                                        </p>
                                                                }
                                                            </Col>
                                                            <Col xs={5} lg={2} className="text-center my-auto">
                                                                {Number(item.price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                                            </Col>
                                                            <Col xs={2} lg={1} className="text-center my-auto border">
                                                                {item.qty}
                                                            </Col>
                                                            <Col xs={5} lg={2} className="text-center my-auto">
                                                                {Number(item.qty * item.price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                                                {item.refunded && <p className="text-danger">(refunded)</p>}
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
                                            {order.refunds && order.refunds.map(refund => (
                                                <p>
                                                    <strong>Refund: </strong>
                                                    {Number(refund.amount / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                                    {" "}({new Date(refund.createdTime).toLocaleString()})
                                                </p>
                                            ))
                                            }


                                        </ListGroup.Item>
                                    </ListGroup>)}

                                    {user.isStaff && (<ListGroup>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col >
                                                    <h4 className="mb-3">Refunds</h4>
                                                    {order.refunds && order.refunds.map(refund => (
                                                        <p>
                                                            <strong>{new Date(refund.createdTime).toLocaleString()}: </strong>
                                                            {Number(refund.amount / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                                        </p>
                                                    ))
                                                    }
                                                </Col>

                                                {user && user.isStaff &&
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

                                                {user && user.isStaff &&
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

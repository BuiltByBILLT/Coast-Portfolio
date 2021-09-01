import React, { useState, useEffect } from 'react'
import { Card, Button, Row, Col, ListGroup, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

export const SideCart = () => {

    const { cartItems, shippingInfo, shippingMethod } = useSelector(state => state.cart)
    const subtotal = cartItems.reduce((acc, curr) => acc + curr.qty * curr.price / 100, 0)
    const taxRate = shippingInfo.taxRate / 10000000
    return (
        <Card>
            <ListGroup className="border p-4">
                {cartItems.map((item) => (
                    <ListGroup.Item key={item.name} className="border-0">
                        <Row className="m-0">
                            <Col xs="auto" className="pl-0 my-auto">
                                ({item.qty})
                            </Col>
                            <Col xs={2} className="p-0">
                                <Image src={"https://www.coastairbrush.com/" + item.image}
                                    alt={item.name} fluid rounded
                                // style={{ height: "100px" }} 
                                />
                            </Col>
                            <Col xs className="my-auto">
                                {item.name}
                            </Col>
                            <Col xs="auto" className="pr-0 my-auto">
                                {Number(item.qty * item.price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}

                <div style={{ height: "2px" }} />

                <ListGroup.Item className=" border-bottom-0 border-left-0 border-right-0 pt-4">
                    <Row className="m-0">
                        <Col xs className="pl-0">
                            Subtotal
                        </Col>
                        <Col xs="auto" className="pr-0">
                            {subtotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item className="border-0">
                    <Row className="m-0">
                        <Col xs className="pl-0">
                            Tax
                        </Col>
                        <Col xs="auto" className="pr-0">
                            {shippingInfo && Object.keys(shippingInfo).length != 0 ?
                                Number(subtotal * taxRate).toLocaleString("en-US", { style: "currency", currency: "USD" })
                                : "-"
                            }
                        </Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item className="border-top-0 border-left-0 border-right-0 pb-4">
                    <Row className="m-0">
                        <Col xs className="pl-0">
                            Shipping
                        </Col>
                        <Col xs="auto" className="pr-0">
                            {shippingMethod && Object.keys(shippingMethod).length != 0 ?
                                Number(shippingMethod.price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
                                : "-"
                            }
                        </Col>
                    </Row>
                </ListGroup.Item>

                <div style={{ height: "2px" }} />

                <ListGroup.Item className="border-0 pt-4">
                    <Row className="m-0">
                        <Col xs className="pl-0">
                            Total
                        </Col>
                        <Col xs="auto" className="pr-0">
                            {Object.keys(shippingMethod).length != 0 && Object.keys(shippingInfo).length != 0 ?
                                Number(subtotal * (1 + taxRate) + shippingMethod.price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
                                : "-"
                            }
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    )
}

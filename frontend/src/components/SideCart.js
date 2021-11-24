import React, { useState, useEffect, useContext } from 'react'
import { Card, Button, Row, Col, ListGroup, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CartContext } from '../contexts/CartContext'
import { envImage, toUSD } from '../common'


export const SideCart = () => {

    const { cartItems, shippingInfo, shippingMethod, discount } = useContext(CartContext)
    const { discountAmount, discountType, discountDescription, discountExclude, discountTotal } = discount


    const subtotal = cartItems.reduce((acc, curr) => acc + curr.qty * curr.price, 0)
    // const taxRate = shippingInfo.taxRate / 10000000
    const taxRate = 0
    const shippingTotal = shippingMethod.price


    var totalTax = (subtotal + shippingTotal) * taxRate
    var totalTotal = subtotal + totalTax + shippingTotal - (discountTotal ? discountTotal : 0)

    const percentDiscount = (cents) => {
        if (discountType === "PERCENT")
            return (Number(cents) * discountAmount) / 100
    }

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
                                <Image src={envImage(item.image)}
                                    alt={item.name} fluid rounded
                                // style={{ height: "100px" }} 
                                />
                            </Col>
                            <Col xs className="my-auto">
                                {item.name}
                            </Col>
                            <Col xs="auto" className="pr-0 my-auto">
                                {toUSD(item.qty * item.price)}
                            </Col>
                        </Row>
                        {discountType == "PERCENT" &&
                            (discountExclude.split(',').includes(item.pID)
                                ? <Row className="m-0">
                                    <Col xs="auto" className="pl-0 my-auto text-danger">
                                        Discounts cannot be applied on this item
                                    </Col>
                                </Row>
                                : <Row className="m-0">
                                    <Col xs="auto" className="pl-0 my-auto text-success">
                                        {discountDescription}
                                    </Col>
                                    <Col xs="auto" className="ml-auto pr-0 my-auto text-success">
                                        -{toUSD(percentDiscount(item.qty * item.price))}
                                    </Col>
                                </Row>)
                        }
                    </ListGroup.Item>
                ))}
                {discountType == "FLAT" &&
                    <ListGroup.Item className="border-0 text-success">
                        <Row className="m-0">
                            <Col xs="auto" className="pl-0 my-auto text-success">
                                {discountDescription}
                            </Col>
                            <Col xs="auto" className="ml-auto pr-0 my-auto text-success">
                                -{toUSD(discountTotal)}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                }

                <div style={{ height: "2px" }} />

                <ListGroup.Item className=" border-bottom-0 border-left-0 border-right-0 pt-4">
                    <Row className="m-0">
                        <Col xs className="pl-0">
                            Subtotal:
                        </Col>
                        <Col xs="auto" className="pr-0">
                            {toUSD(subtotal)}
                        </Col>
                    </Row>
                </ListGroup.Item>
                {Object.keys(shippingInfo).length != 0 &&
                    <ListGroup.Item className="border-0">
                        <Row className="m-0">
                            <Col xs className="pl-0">
                                Tax:
                            </Col>
                            <Col xs="auto" className="pr-0">
                                {toUSD(totalTax)}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                }
                {Object.keys(shippingMethod).length != 0 &&
                    <ListGroup.Item className="border-top-0 border-left-0 border-right-0 pb-4">
                        <Row className="m-0">
                            <Col xs className="pl-0">
                                Shipping:
                            </Col>
                            <Col xs="auto" className="pr-0">
                                {toUSD(shippingMethod.price)}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                }
                {Object.keys(discount).length != 0 &&
                    <ListGroup.Item className="border-0">
                        <Row className="m-0">
                            <Col xs className="pl-0">
                                Discount Total:
                            </Col>
                            {/* <Col>{discountDescription}</Col> */}
                            <Col xs="auto" className="pr-0">
                                {"(" + toUSD(discountTotal) + ")"}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                }

                <div style={{ height: "2px" }} />

                {Object.keys(shippingMethod).length != 0 && Object.keys(shippingInfo).length != 0 &&
                    <ListGroup.Item className="border-0 pt-4">
                        <Row className="m-0">
                            <Col xs className="pl-0">
                                Total:
                            </Col>
                            <Col xs="auto" className="pr-0">
                                {toUSD(totalTotal)}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                }
            </ListGroup>
        </Card >
    )
}

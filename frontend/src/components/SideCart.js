import React, { useState, useEffect } from 'react'
import { Card, Button, Row, Col, ListGroup, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

export const SideCart = () => {

    const { cartItems, shippingInfo, shippingMethod, discount } = useSelector(state => state.cart)
    if (discount) var { discountAmount, discountType, discountName } = discount

    const subtotal = cartItems.reduce((acc, curr) => acc + curr.qty * curr.price, 0)
    const taxRate = shippingInfo.taxRate / 10000000
    const shippingTotal = shippingMethod.price

    if (discount && discountAmount && discountType === "$") {
        var totalDiscount = discountAmount * 100
        var totalTax = (subtotal - totalDiscount) * taxRate
        var totalTotal = subtotal + totalTax + shippingTotal - totalDiscount
    }
    else if (discount && discountAmount && discountType === "%") {
        var totalTax = subtotal * taxRate * (100 - discountAmount) / 100
        var totalDiscount = (subtotal + shippingTotal) * (discountAmount) / 100
        var totalTotal = subtotal + totalTax + shippingTotal - totalDiscount
    }
    else {
        var totalTax = subtotal * taxRate
        var totalDiscount = 0
        var totalTotal = subtotal + totalTax + shippingTotal
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
                            Subtotal:
                        </Col>
                        <Col xs="auto" className="pr-0">
                            {Number(subtotal / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item className="border-0">
                    <Row className="m-0">
                        <Col xs className="pl-0">
                            Tax:
                        </Col>
                        <Col xs="auto" className="pr-0">
                            {shippingInfo && Object.keys(shippingInfo).length != 0 ?
                                Number(totalTax / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
                                : "-"
                            }
                        </Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item className="border-top-0 border-left-0 border-right-0 pb-4">
                    <Row className="m-0">
                        <Col xs className="pl-0">
                            Shipping:
                        </Col>
                        <Col xs="auto" className="pr-0">
                            {shippingMethod && Object.keys(shippingMethod).length != 0 ?
                                Number(shippingMethod.price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
                                : "-"
                            }
                        </Col>
                    </Row>
                </ListGroup.Item>
                {discount && discount.discountAmount != 0 &&
                    <ListGroup.Item className="border-0">
                        <Row className="m-0">
                            <Col xs className="pl-0">
                                Discounts:
                            </Col>
                            <Col>{discount && discount.discountAmount != 0 && discount.discountName}</Col>
                            <Col xs="auto" className="pr-0">
                                {"(" + Number(totalDiscount / 100).toLocaleString("en-US", { style: "currency", currency: "USD" }) + ")"}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                }

                <div style={{ height: "2px" }} />

                <ListGroup.Item className="border-0 pt-4">
                    <Row className="m-0">
                        <Col xs className="pl-0">
                            Total:
                        </Col>
                        <Col xs="auto" className="pr-0">
                            {Object.keys(shippingMethod).length != 0 && Object.keys(shippingInfo).length != 0 ?
                                Number(totalTotal / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
                                : "-"
                            }
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    )
}

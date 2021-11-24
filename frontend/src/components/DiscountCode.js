import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Button, Col, FormControl, InputGroup, ListGroup, Modal, Row } from 'react-bootstrap'
import { useMutation } from 'react-query'
import { CartContext, CartContextUpdate } from '../contexts/CartContext'
import { UserContext } from '../contexts/UserContext'
import Message from './Message'

const DiscountCode = () => {

    const user = useContext(UserContext)
    const cart = useContext(CartContext)
    const updateCart = useContext(CartContextUpdate)
    const [code, setCode] = useState("")
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")


    const { mutate, reset } = useMutation(data => {
        return axios.post(`/api/discounts/apply/${data.code}`, data.cartItems)
    }, {
        onSuccess: (data) => {
            // console.log(data.data)
            setSuccess(`Added Discount ${data.data.discountCode} Successfully`)
            setError("")
            updateCart({ type: "ADD_DISCOUNT", discount: data.data })
            // reset()
        },
        onError: (error) => {
            setSuccess("")
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    const applyHandler = () => {
        if (code) mutate({ code, cartItems: cart.cartItems })
        setCode("")
    }

    const removeHandler = () => {
        updateCart({ type: "ADD_DISCOUNT", discount: {} })
        setSuccess("")
    }

    return (
        <>
            {Object.keys(cart.discount) != 0 &&
                <ListGroup.Item className="">
                    <Row>
                        <Col>
                            <strong>Discount: </strong> {cart.discount.discountDescription}
                        </Col>
                        <Col xs="auto" className="text-right">
                            <a className="text-muted" style={{ cursor: "pointer" }}
                                onClick={removeHandler}>
                                Remove
                            </a>
                        </Col>
                    </Row>
                </ListGroup.Item>}
            <ListGroup.Item className="py-0 pl-0">
                <Row>
                    <Col>
                        <FormControl placeholder="Enter Discount Code" value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                        />
                    </Col>
                    <Col xs="auto" className="px-4 my-auto">
                        <a className="text-muted" style={{ cursor: "pointer" }}
                            onClick={applyHandler}>
                            Apply
                        </a>
                    </Col>
                </Row>
            </ListGroup.Item>
            {error && <p className="text-danger px-4">{error}</p>}
            {success && <p className="text-success px-4">{success}</p>}
        </>
    )
}

export default DiscountCode

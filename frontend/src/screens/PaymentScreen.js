import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Col, Row, ListGroup, Modal, Container, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useMutation } from 'react-query'
import Message from '../components/Message'
import { SideCart } from '../components/SideCart'
import Loader from '../components/Loader'
import { CLOVER_RESET, CART_SET_DISCOUNT } from '../constants/cartConstants'
import { CartContext, CartContextUpdate } from '../contexts/CartContext'
import { UserContext } from '../contexts/UserContext'
import DiscountCode from '../components/DiscountCode'
import DiscountNewScreen from './DiscountNewScreen'


const PaymentScreen = ({ history }) => {
    const cart = useContext(CartContext)
    const { shippingMethod, shippingInfo } = cart
    const updateCart = useContext(CartContextUpdate)
    const user = useContext(UserContext)

    useEffect(() => {
        if (Object.keys(shippingMethod).length == 0) history.push('/shippingmethod')
    }, [shippingMethod])

    const [buttonDisable, setButtonDisable] = useState(false)
    const [discountModal, setDiscountModal] = useState(false)


    const styles = {
        body: { fontFamily: 'Roboto, Open Sans, sans-serif', fontSize: '16px', },
        input: {
            fontSize: '13px',
            border: " 1px solid rgba(0, 0, 0, 0.125)",
            height: '50px',
            padding: '8px'
        },
        img: { right: '10px !important', top: '10px !important', }
    };
    const elements = window.clover.elements();
    const cardNumber = elements.create('CARD_NUMBER', styles);
    const cardDate = elements.create('CARD_DATE', styles);
    const cardCvv = elements.create('CARD_CVV', styles);
    const cardPostalCode = elements.create('CARD_POSTAL_CODE', styles);


    // Load iFrame 
    useEffect(() => {
        cardNumber.mount('#card-number');
        cardDate.mount('#card-date');
        cardCvv.mount('#card-cvv');
        cardPostalCode.mount('#card-postal-code');

        const cloverFooter = document.getElementsByClassName('clover-footer')[0];
        const footer = document.querySelector('footer');
        if (cloverFooter) cloverFooter.style.display = "block"
        cloverFooter && footer.insertBefore(cloverFooter, footer.childNodes[0])

        return () => { if (cloverFooter) cloverFooter.style.display = "none" }
    }, []);


    const { data: order, error, isLoading: loading, mutate } = useMutation(data => {
        return axios.post(`/api/clover`, data)
    })

    // Redirect to Order after Submit
    useEffect(() => {
        if (order) {
            updateCart({ type: "RESET_CART" })
            history.push(`/order/${order.data.id}`)
        }
    }, [order])


    const submitHandler = (e) => {
        e.preventDefault()
        setButtonDisable(true)

        window.clover.createToken()
            .then((result) => {
                if (result.errors) {
                    const displayError = document.getElementById('card-errors');
                    Object.values(result.errors).forEach(function (value) {
                        displayError.textContent = value;
                    });
                    setButtonDisable(false)
                } else {
                    mutate({ cart, userInfo: user, token: result.token })
                }
                setButtonDisable(false)
            })
    }

    return (
        <Container className="my-5 py-3">
            <Modal show={loading} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Sumbitting Order...
                        <br /> Please do not close this window</Modal.Title>
                </Modal.Header>
                <Modal.Body> <Loader /> </Modal.Body>
            </Modal>
            {error && <Message variant='danger'>{error.response ? "!" + JSON.stringify(error.response.data.message) : "~" + error.message}</Message>}
            {order && <Message variant='success'>{"Success! " + order.id}</Message>}

            <Row>
                <Col lg={6}>
                    {/* <h5 className="">Shipping Information</h5> */}
                    <ListGroup>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    <strong>Contact:</strong> {shippingInfo.email}
                                </Col>
                                <Col xs="auto" className="text-right">
                                    <Link to="/shipping" className="text-muted">Change</Link>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    <strong>Ship to: </strong>
                                    <br /> {shippingInfo.address1} {shippingInfo.address2}
                                    <br />{shippingInfo.city}, {shippingInfo.region}, {shippingInfo.country}, {shippingInfo.postalCode}
                                </Col>
                                <Col xs="auto" className="text-right">
                                    <Link to="/shipping" className="text-muted">Change</Link>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    <strong>Shipping Method: </strong> {shippingMethod.method}
                                </Col>
                                <Col xs="auto" className="text-right">
                                    <Link to="/shippingmethod" className="text-muted">Change</Link>
                                </Col>
                            </Row>
                        </ListGroup.Item>

                        <DiscountCode />

                    </ListGroup>

                    <h5 className="mt-5">Payment Information</h5>

                    <div className="App" id="iframeapp">
                        <div id="card-errors" role="alert" style={{ color: "red" }} />
                        <div className="flex justify-center mt-16">
                            <Form id="payment-form" noValidate autoComplete="off">
                                <Form.Row >
                                    <Col>
                                        <div id="card-number" className="" style={{ height: "60px" }} />
                                    </Col>
                                </Form.Row>

                                <Form.Row>
                                    <Col >
                                        <div id="card-date" className="" style={{ height: "60px" }} />
                                    </Col>
                                    <Col >
                                        <div id="card-cvv" className="" style={{ height: "60px" }} />
                                    </Col>
                                    <Col >
                                        <div id="card-postal-code" className="" style={{ height: "60px" }} />
                                    </Col>
                                </Form.Row>
                                {/* </fieldset> */}
                            </Form>

                            <Button variant="primary" size="large" className="mt-3 px-5"
                                disabled={buttonDisable}
                                onClick={submitHandler} >
                                Pay Now
                            </Button>

                            {user.isStaff && <Button variant="outline-secondary" size="large" className="mt-3 px-3 ml-5"
                                onClick={() => setDiscountModal(true)} >
                                Create Discount Code
                            </Button>}
                            <Modal show={discountModal} backdrop="static" keyboard={false} onHide={() => setDiscountModal(false)}>
                                <Modal.Header closeButton></Modal.Header>
                                <Modal.Body><DiscountNewScreen popup={true} />  </Modal.Body>
                            </Modal>
                        </div>
                    </div>
                </Col>
                <Col lg={6} className="pl-5 d-none d-lg-block">
                    <SideCart />
                </Col>
            </Row>
        </Container >

    )
}

export default PaymentScreen

import React, { useState, useEffect } from 'react'
import { Form, Button, Col, Row, ListGroup, Modal, Container, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useMutation } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { afterOrderReset, resetCart, savePaymentMethod, submitClover } from '../actions/cartActions'
import { Helmet } from 'react-helmet'
import Message from '../components/Message'
import { SideCart } from '../components/SideCart'
import Loader from '../components/Loader'
import { CLOVER_RESET, CART_SET_DISCOUNT } from '../constants/cartConstants'


const PaymentScreen = ({ history }) => {
    const { shippingMethod, shippingInfo, cartItems } = useSelector(state => state.cart)
    const { userInfo } = useSelector(state => state.userLogin)
    // const { loading, order, error } = useSelector(state => state.clover)

    if (shippingInfo && Object.keys(shippingInfo).length == 0) {
        history.push('/shipping')
    }
    if (shippingMethod && Object.keys(shippingMethod).length == 0) {
        history.push('/shippingmethod')
    }

    const [buttonDisable, setButtonDisable] = useState(false)
    const [discountEdit, setDiscountEdit] = useState(false)
    const [discountName, setDiscountName] = useState("")
    const [discountType, setDiscountType] = useState("$")
    const [discountAmount, setDiscountAmount] = useState("")

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


    const dispatch = useDispatch()
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

    // Redirect to Order after Submit
    useEffect(() => {
        if (order) {
            dispatch(resetCart())
            dispatch({ type: CLOVER_RESET })
            history.push(`/order/${order.id}`)
        }
    }, [order])

    const { data: order, error, isLoading: loading, mutate } = useMutation(data => {
        return axios.post(`/api/clover`, data)
    })

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
                    // dispatch(submitClover(result.token))
                    mutate(result.token)
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
            {error && <Message variant='danger'>{JSON.stringify(error)}</Message>}
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
                                    <br /> {shippingInfo.address} {shippingInfo.address2}
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
                        {userInfo && userInfo.isStaff === true &&
                            (<ListGroup.Item>
                                <Form >
                                    <Row>
                                        <Col>
                                            {discountEdit ?
                                                (
                                                    <Form.Row>
                                                        <Col>
                                                            <Form.Control type="text" placeholder="Name (Required)" value={discountName} className="p-3"
                                                                onChange={(e) => setDiscountName(e.target.value)}
                                                            ></Form.Control>
                                                        </Col>
                                                        <Col>
                                                            <InputGroup>
                                                                <DropdownButton
                                                                    as={InputGroup.Prepend}
                                                                    variant="outline-secondary"
                                                                    title={discountType === "$" ? "$" : "%"}
                                                                    className="p-0"
                                                                    style={{ height: "47px" }}
                                                                >
                                                                    <Dropdown.Item onClick={() => setDiscountType("$")}>
                                                                        $
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setDiscountType("%")}>
                                                                        %
                                                                    </Dropdown.Item>
                                                                </DropdownButton>
                                                                <Form.Control type="text" placeholder="0.00" value={discountAmount} className="p-3"
                                                                    onChange={(e) => setDiscountAmount(e.target.value)}>
                                                                </Form.Control>
                                                            </InputGroup>
                                                        </Col>
                                                    </Form.Row>
                                                ) : (
                                                    <>
                                                        <strong>{'Discount: '}</strong>
                                                        {discountAmount !== "" ?
                                                            discountType === "$"
                                                                ? `(${discountName}) ${discountType}${discountAmount} off`
                                                                : `(${discountName}) ${discountAmount}${discountType} off`
                                                            : ""
                                                        }
                                                    </>
                                                )
                                            }
                                        </Col>
                                        <Col xs="auto" className="text-right">
                                            {discountEdit ?
                                                (<Link to="#" className="text-danger"
                                                    onClick={() => {
                                                        setDiscountEdit(false)
                                                        dispatch({
                                                            type: CART_SET_DISCOUNT, payload: {
                                                                discountName, discountType, discountAmount
                                                            }
                                                        })
                                                    }}
                                                >Save</Link>
                                                ) : (<Link to="#" className="text-muted"
                                                    onClick={() => setDiscountEdit(true)}
                                                >Change</Link>)
                                            }
                                        </Col>
                                    </Row>
                                </Form>
                            </ListGroup.Item>)
                        }
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
                            {/* <Button variant="outline-danger" size="large" onClick={testHandler} className="ml-3 mt-3 px-5">
                                Test Now
                            </Button> */}
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

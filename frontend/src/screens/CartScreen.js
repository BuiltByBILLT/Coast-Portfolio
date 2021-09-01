import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, cartToClover, cartToDB, loadCartFromDB, getClover, modifyCart, removeFromCart } from '../actions/cartActions'
import Message from '../components/Message'
import { Container, Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CART_LOAD_FROM_DB } from '../constants/cartConstants'

const CartScreen = ({ match, location, history }) => {
    const cartId = match.params.id
    const qty = location.search ? Number(location.search.split('=')[1]) : 1

    const dispatch = useDispatch()

    const { cartItems } = useSelector(state => state.cart)
    const { userInfo } = useSelector(state => state.userLogin)
    const { cartFromDB } = useSelector(state => state.cart)

    useEffect(() => {
        if (cartFromDB == "reset") {
            history.push(`/cart`)
        }
        else if (cartFromDB) {
            history.push(`/cart/${cartFromDB}`)
        } else {
            if (cartId) {
                if (window.confirm(`Clicking OK will override your cart with a new one\nCancel to return to your existing cart`)) {
                    dispatch(loadCartFromDB(cartId))
                } else {
                    history.push(`/cart`)
                }
            }
        }
    }, [cartFromDB])


    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }
    const checkoutHandler = () => {
        // dispatch(getClover())
        // dispatch(cartToClover())
        // history.push('/login?redirect=shipping')
        history.push('/shipping')
    }
    const sendCartHandler = () => {
        dispatch(cartToDB())
    }


    return (
        <Container className="my-5 py-3">
            <Row className="mt-5 mb-5">
                <Col lg="auto">
                    <h3 className="text-danger text-break m-0">Shopping Cart</h3>
                </Col>
                <Col className="mt-3 mt-lg-auto">
                    <p className="my-0">{cartId}</p>
                </Col>
            </Row>

            {
                cartItems.length === 0 ? (
                    <Message>
                        Your Cart is empty <Link to="/"> Go Back</Link>
                    </Message>
                ) : (
                    <Row>
                        <Col lg={9}>
                            <ListGroup>
                                <ListGroup.Item className="mb-3 border-left-0 border-right-0 px-0">
                                    <Row>
                                        <Col xs={4} lg={3} className="mb-3 mb-lg-0 my-auto d-none d-lg-block">
                                            <h6>Product</h6>
                                        </Col>
                                        <Col className="d-none d-lg-block my-auto">
                                        </Col>
                                        <Col xs={4} lg={"auto"} className="text-center my-auto px-2"
                                            style={{ width: "100px" }}
                                        >
                                            <h6>Price</h6>
                                        </Col>
                                        <Col xs={4} lg={"auto"} className="text-center my-auto px-2"
                                            style={{ width: "150px" }}
                                        >
                                            <h6>Qty</h6>
                                        </Col>
                                        <Col xs={4} lg={"auto"} className="text-center my-auto px-2"
                                            style={{ width: "100px" }}
                                        >
                                            <h6>Total</h6>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {cartItems.map((item, index) => (
                                    <ListGroup.Item key={index} className="mb-3 border-0 px-0">
                                        <Row>
                                            <Col xs={12} lg={"auto"} className="text-center mb-3 mb-lg-0"
                                                style={{ width: "100px" }}
                                            >
                                                <Image src={"https://www.coastairbrush.com/" + item.image}
                                                    alt={item.name} fluid rounded
                                                // style={{ height: "100px" }} 
                                                />
                                            </Col>
                                            <Col xs={12} lg className="mb-2 my-lg-auto text-center text-lg-left">
                                                <Link to={`/product/${item.cloverID}`}>{item.name}</Link>
                                            </Col>
                                            <Col xs={4} lg={"auto"} className="text-center my-auto px-2"
                                                style={{ width: "100px" }}
                                            >
                                                {Number(item.price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                            </Col>
                                            <Col xs={4} lg={"auto"} className="text-center my-auto px-0"
                                                style={{ width: "150px" }}
                                            >
                                                <Form.Control className='form-select mx-auto p-1'
                                                    as='select' value={item.qty}
                                                    onChange={(e) => dispatch(modifyCart(item.pID, e.target.value))}
                                                    style={{ width: "60px" }}
                                                >
                                                    {[...Array(item.countInStock).keys()].map(x => (
                                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                    ))}
                                                </Form.Control>
                                                <Button className="p-2 m-0"
                                                    style={{ width: "30px" }}
                                                    type='button' variant='light' onClick={
                                                        () => removeFromCartHandler(item.pID)}
                                                ><i className='fas fa-trash' />
                                                </Button>
                                            </Col>

                                            <Col xs={4} lg={"auto"} className="text-center my-auto  px-0"
                                                style={{ width: "100px" }}
                                            >
                                                {Number(item.qty * item.price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                        <Col lg={3} className="pl-lg-4 pr-lg-0">
                            <Card>
                                <ListGroup>
                                    <ListGroupItem>
                                        <h4>({cartItems.reduce((acc, curr) => acc + Number(curr.qty), 0)}) Items</h4>
                                        <br></br>
                                        <h5>Subtotal</h5>
                                        <h4>
                                            {cartItems
                                                .reduce((acc, curr) => acc + curr.qty * curr.price / 100, 0)
                                                .toLocaleString("en-US", { style: "currency", currency: "USD" })
                                            }
                                        </h4>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Button type='button' block disabled={cartItems.length === 0} onClick={checkoutHandler}>
                                            Proceed to Checkout
                                        </Button>
                                        {userInfo && userInfo.isStaff && (<Button type='button' block variant="danger"
                                            disabled={cartItems.length === 0 || cartId}
                                            onClick={sendCartHandler}>
                                            Save and Send Cart
                                        </Button>)}
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>


                )
            }

        </Container>
    )
}

export default CartScreen

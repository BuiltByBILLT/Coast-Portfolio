import React, { useContext, useEffect, useState } from 'react'
import Message from '../components/Message'
import { Container, Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CartContext, CartContextUpdate } from '../contexts/CartContext'
import { UserContext } from '../contexts/UserContext'
import { useMutation, useQuery } from 'react-query'
import axios from 'axios'
import { envImage } from '../common'

const CartScreen = ({ match, history }) => {

    const cartID = match.params.id

    const user = useContext(UserContext)
    const { cartItems } = useContext(CartContext)
    const updateCart = useContext(CartContextUpdate)
    const [error, setError] = useState("")
    const [overRide, setOverRide] = useState(false)


    useEffect(() => {
        if (cartID) {
            if (user.isStaff || window.confirm(`You are about to load cart: ${cartID}
                Clicking OK will override your cart with a new one
                Clicking Cancel will return you to your existing cart`)) {
                setOverRide(true)
            } else { history.push('/cart') }
        }
    }, [cartID])

    // Query: Get Details
    const { refetch } = useQuery([`cart`, cartID], () => {
        return axios.get(`/api/cart/${cartID}`)
    }, {
        enabled: overRide,
        onSuccess: (data) => {
            console.log(data.data)
            updateCart({ type: "LOAD_URL_CART", urlCartItems: data.data.cartItems })
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Mutation: Update Brand 
    const { mutate, isSuccess, reset } = useMutation(data => {
        return axios.post(`/api/cart`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setError("")
            history.push(`/cart/${data.data.cartID}`)
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Handlers
    const removeHandler = (cloverID) => {
        updateCart({ type: "REMOVE_ITEM", cloverID })
        history.push("/cart")
    }
    const qtyHandler = (cartItem, qty) => {
        updateCart({ type: "QTY_ITEM", cartItem: { ...cartItem, qty } })
        history.push("/cart")
    }
    const checkoutHandler = () => {
        history.push('/shipping')
    }
    const sendCartHandler = () => {
        mutate(cartItems)
    }


    return (
        <Container className="my-5 py-3">
            <Row className=" mb-5">
                <Col lg="auto">
                    <h3 className="text-danger text-break m-0">Shopping Cart</h3>
                </Col>
                <Col className="mt-3 mt-lg-auto">
                    <p className="my-0">{cartID}</p>
                </Col>
            </Row>
            {error && <Message variant="danger">{error}</Message>}

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
                                                <Image src={envImage(item.image)}
                                                    alt={item.name} fluid rounded
                                                // style={{ height: "100px" }} 
                                                />
                                            </Col>
                                            <Col xs={12} lg className="mb-2 my-lg-auto text-center text-lg-left">
                                                <Link to={`/product/${item.pID}`}>{item.name}</Link>
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
                                                    onChange={(e) => qtyHandler(item, e.target.value)}
                                                    style={{ width: "60px" }}
                                                >
                                                    {[...Array(item.stock).keys()].map(x => (
                                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                    ))}
                                                </Form.Control>
                                                <Button className="p-2 m-0"
                                                    style={{ width: "30px" }}
                                                    type='button' variant='light' onClick={
                                                        () => removeHandler(item.cloverID)}
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
                                        {user.isStaff && (<Button type='button' block variant="danger"
                                            disabled={cartItems.length === 0 || cartID}
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

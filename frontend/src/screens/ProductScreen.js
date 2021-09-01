import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form, Breadcrumb, Container } from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import Suggested from '../components/Suggested'
import ProductCrumbs from '../components/ProductCrumbs'

import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails, resetProductDetails, createProductReview } from '../actions/productActions'
import { getCategoryDetails } from '../actions/categoryActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

import "../styles/ProductPage.css"
import { addToCart } from '../actions/cartActions'

const ProductScreen = ({ history, match }) => {
    const [qty, setQty] = useState(1)
    // const [rating, setRating] = useState(0)
    // const [comment, setComment] = useState("")

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    // const userLogin = useSelector(state => state.userLogin)
    // const { userInfo } = userLogin

    // const productReviewCreate = useSelector(state => state.productReviewCreate)
    // const { success: successProductReview, error: errorProductReview } = productReviewCreate

    const { category } = useSelector(state => state.categoryDetails)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        // if (successProductReview) {
        //     setRating(0)
        //     setComment('')
        // }
        // dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        dispatch(listProductDetails(match.params.id))
        return () => {
            dispatch(resetProductDetails());
        };
    }, [dispatch, match])

    const addToCartHandler = () => {
        // history.push(`/cart/${match.params.id}?qty=${qty}`)
        window.scrollTo({ top: 0, behavior: "smooth" });
        dispatch(addToCart(product, qty))
    }
    // const submitHandler = (e) => {
    //     e.preventDefault()
    //     dispatch(createProductReview(match.params.id, { rating, comment }))
    // }

    return (
        <Container className="my-5 py-3">
            {loading ? <Loader />
                : error ? (<Message variant='danger'>{error}</Message>)
                    : (<>
                        {/* <Meta title={product.pName} /> */}
                        {product && <ProductCrumbs product={product} />}
                        <Row className="mb-5 productPage">
                            <Col lg={5} className="pr-5 mt-3">
                                {product.images && product.images[0] &&
                                    <Image src={"https://www.coastairbrush.com/" + product.images[0].imageSrc} alt={product.pName}
                                        style={{ width: "100%", objectFit: "contain" }}

                                    />}
                            </Col>
                            <Col lg={7} >
                                <h3 className="text-danger">{product.topSection}</h3>
                                <h5 className="mt-3 mb-1">{"Product ID: " + product.pID}</h5>
                                <h5 className="mt-1 mb-3">{product.pName}</h5>
                                <h3 className="text-danger"> {Number(product.pPrice / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</h3>
                                <span className="pr-4"> {Number(product.pPrice * 0.0084).toLocaleString("en-US", { style: "currency", currency: "EUR" })}</span>
                                <span className="pr-4"> {Number(product.pPrice * 0.0136).toLocaleString("en-US", { style: "currency", currency: "USD" })} AUD</span>
                                <span className="pr-4"> {Number(product.pPrice * .0124).toLocaleString("en-US", { style: "currency", currency: "USD" })} CAD</span>
                                <Row className="mt-5">

                                </Row>
                                <Row className="align-items-center mb-4">
                                    <Col xs="auto">
                                        <Form.Control className='form-select' as='select' value={qty}
                                            onChange={(e) => setQty(e.target.value)}>
                                            {[...Array(product.pInStock).keys()].map(x => (
                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                            ))}
                                        </Form.Control>
                                    </Col >
                                    <Col xs="auto">
                                        <Button
                                            block
                                            onClick={addToCartHandler}
                                        // disabled={product.countInStock === 0}
                                        >Add to Cart
                                        </Button>
                                    </Col>
                                    <Col xs="auto" className="px-2">
                                        <i className='far fa-heart fa-2x text-danger'></i>
                                    </Col>
                                </Row>
                                <h5 className="pt-3">Description</h5>
                                <div dangerouslySetInnerHTML={{ __html: "Description: " + product.pDescription }} />
                            </Col>
                        </Row>
                        <h4 className="text-danger mb-4 mt-5">You May Also Like</h4>
                        <Suggested />
                    </>
                    )
            }
        </Container>
    )
}

export default ProductScreen

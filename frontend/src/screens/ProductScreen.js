import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form, Breadcrumb, Container } from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import Suggested from '../components/Suggested'
import ProductCrumbs from '../components/ProductCrumbs'
import ImageDisplay from '../components/ImageDisplay'

import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails, resetProductDetails, createProductReview } from '../actions/productActions'
import { getCategoryDetails } from '../actions/categoryActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

import "../styles/ProductPage.css"
import { addToCart } from '../actions/cartActions'
import { HeartList } from '../components/HeartList'

const ProductScreen = ({ history, match }) => {
    const { loading, error, product } = useSelector(state => state.productDetails)
    const { category } = useSelector(state => state.categoryDetails)
    const { userInfo } = useSelector(state => state.userLogin)


    const [qty, setQty] = useState(1)
    const [stock, setStock] = useState(0)
    const [option, setOption] = useState(0)
    const [price, setPrice] = useState(0)
    const [cloverID, setCloverID] = useState("")
    const [name, setName] = useState(product.pName)

    const dispatch = useDispatch()
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        dispatch(listProductDetails(match.params.id))
        return () => {
            dispatch(resetProductDetails());
        };
    }, [dispatch, match])


    useEffect(() => {
        setName(product.pName)
        if (product.options && product.options.length == 1) {
            setPrice(product.options[0].iPrice)
            setStock(product.options[0].iStock)
            setCloverID(product.options[0].cloverID)
            // setName(`${product.pName} (${product.options[0].iSelectionName})`)
        }
        else if (product.options && product.options.length > 1 && option != 0) {
            setPrice(product.options[option - 1].iPrice)
            setCloverID(product.options[option - 1].cloverID)
            setName(`${product.pName} (${product.options[option - 1].iSelectionName})`)
            setStock(product.options[option - 1].iStock)
        } else {

        }
    }, [option, product])

    const addToCartHandler = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        dispatch(addToCart(product, name, qty, stock, price, cloverID))
    }


    return (
        <Container className="my-5 py-3">
            {loading ? <Loader />
                : error ? (<Message variant='danger'>{error}</Message>)
                    : (<>
                        {/* <Meta title={product.pName} /> */}
                        {product && <ProductCrumbs product={product} />}
                        <Row className="mb-5 productPage">
                            <Col lg={5} className="pr-5 mt-3">
                                {product.images && <ImageDisplay product={product} />}
                            </Col>
                            <Col lg={7} >
                                <h3 className="text-danger">{product.topSection}</h3>
                                <h5 className="mt-3 mb-1">{"Product ID: " + product.pID}</h5>
                                <h5 className="mt-1 mb-3">{product.pName}</h5>
                                <h3 className="text-danger"> {Number(price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                    <span className="ml-4 text-muted" style={{ textDecoration: "line-through" }}>
                                        {product.pListPrice ? Number(product.pListPrice / 100).toLocaleString("en-US", { style: "currency", currency: "USD" }) : ""}
                                    </span>
                                </h3>
                                <span className="pr-4"> {Number(price * 0.0084).toLocaleString("en-US", { style: "currency", currency: "EUR" })}</span>
                                <span className="pr-4"> {Number(price * 0.0136).toLocaleString("en-US", { style: "currency", currency: "USD" })} AUD</span>
                                <span className="pr-4"> {Number(price * .0124).toLocaleString("en-US", { style: "currency", currency: "USD" })} CAD</span>
                                <Row className="my-4">
                                    {product.optionGroup &&
                                        <Col xs="auto">
                                            <Form.Control as="select" value={option}
                                                onChange={(e) => setOption(e.target.value)}>
                                                <option key={0} value={0}>{product.optionGroup}</option>
                                                {product.options.map((option, index) => (
                                                    <option key={index + 1} value={index + 1}>{option.iSelectionName}</option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                    }
                                </Row>
                                <Row className="align-items-center mb-4">
                                    <Col xs="auto">
                                        <Form.Control className='form-select' as='select' value={qty} disabled={stock < 1}
                                            onChange={(e) => setQty(e.target.value)}>
                                            {stock < 1 && !product.optionGroup ? <option>Out of Stock</option>
                                                : [...Array(stock > 0 ? stock : 0).keys()].map(x => (
                                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                ))}
                                        </Form.Control>
                                    </Col >
                                    <Col xs="auto">
                                        <Button
                                            block
                                            onClick={addToCartHandler}
                                            disabled={product.optionGroup && option == 0 || stock < 1}
                                        // disabled={product.countInStock === 0}
                                        >Add to Cart
                                        </Button>
                                    </Col>
                                    <Col xs="auto" className="px-2">
                                        <HeartList pID={product.pID} size="2x" />
                                    </Col>
                                </Row>
                                <h5 className="pt-3">Description</h5>
                                {product.pLongDescription
                                    ? <div dangerouslySetInnerHTML={{ __html: product.pLongDescription }} />
                                    : <div dangerouslySetInnerHTML={{ __html: product.pDescription }} />
                                }
                            </Col>
                        </Row>
                        <h4 className="text-danger my-4 pt-5">You May Also Like</h4>
                        <Suggested />
                    </>
                    )
            }
        </Container>
    )
}

export default ProductScreen

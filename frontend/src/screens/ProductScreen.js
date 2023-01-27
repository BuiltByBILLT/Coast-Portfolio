import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, Button, Form, Container } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Suggested from '../components/Suggested'
import ProductCrumbs from '../components/ProductCrumbs'
import ImageDisplay from '../components/ImageDisplay'

import { HeartList } from '../components/HeartList'
import { CartContextUpdate } from '../contexts/CartContext'
import axios from 'axios'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import useCategories from '../hooks/useCatergories'

const ProductScreen = ({ match }) => {

    const pID = decodeURIComponent(match.params.id)
    const encoded = match.params.id
    const cartUpdate = useContext(CartContextUpdate)
    const categories = useCategories()

    const [qty, setQty] = useState(0)
    const [stock, setStock] = useState(0)
    const [option, setOption] = useState(0)
    const [price, setPrice] = useState(0)
    const [listPrice, setListPrice] = useState(0)
    const [cloverID, setCloverID] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")

    const { isLoading, data } = useQuery(pID, () => {
        return axios.get(`/api/products/details/${encoded}`)
    }, {
        onSuccess: ({ data: { cloverID, pPrice, pListPrice, pName, pStock, optionGroup } }) => {
            setPrice(pPrice)
            setListPrice(pListPrice)
            setCloverID(cloverID)
            setName(pName)
            setStock(pStock)
            pStock > 0 && setQty(1)
            optionGroup && setOption(99)
        },
        onError: ({ response, message }) => {
            setError(response?.data.message || message)
        }
    })
    const product = data?.data || {}
    const { pName, optionGroup, options, pDescription, pLongDescription, pSection } = product
    const image = product.images && product.images[0] && product.images[0].imageSrc
    const missingData = !pID || !cloverID || !name || !price || !qty || !stock || !pSection


    const optionHandler = (e) => {
        setOption(e)
        setCloverID(e == 99 ? "" : options[e].cloverID)
        setName(e == 99 ? "" : product.name + " " + options[e].oName)
        setPrice(e == 99 ? 0 : options[e].oPrice)
        setStock(e == 99 ? 0 : options[e].oStock)
        setQty(e == 99 ? 0 : options[e].oStock ? 1 : 0)
    }

    const addToCartHandler = () => {
        if (missingData) return
        window.scrollTo({ top: 0, behavior: "smooth" });
        cartUpdate({
            type: "ADD_ITEM",
            cartItem: { pID, cloverID, name, image, price, qty, stock, category: pSection }
        })
    }


    if (error) return <Container className="my-5 py-3"><Message variant='danger'>{error}</Message></Container>
    if (isLoading) return <Container className="my-5 py-3"><Loader /></Container>
    return (
        <Container className="my-lg-5 py-3">
            {<ProductCrumbs product={product} />}
            <Row className="mb-5 mt-4">
                <Col lg={5} className="pr-5">
                    {product.images && <ImageDisplay product={product} />}
                </Col>
                <Col lg={7} >
                    <h3><Link to={`/category/${product.pSection}`} className="text-danger" >
                        {categories?.find(cat => cat.sectionID == product.pSection)?.sectionName || "Category"}
                    </Link>
                    </h3>
                    <h4 className="mt-3 mb-1">{"Product ID: " + pID}</h4>
                    <h4 className="mt-1 mb-3">{pName}</h4>
                    <h3 className="text-danger"> {Number(price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        <span className="ml-4 text-muted" style={{ textDecoration: "line-through" }}>
                            {listPrice && Number(listPrice / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </span>
                    </h3>
                    <span className="pr-4"> {Number(price * 0.0084).toLocaleString("en-US", { style: "currency", currency: "EUR" })}</span>
                    <span className="pr-4"> {Number(price * 0.0136).toLocaleString("en-US", { style: "currency", currency: "USD" })} AUD</span>
                    <span className="pr-4"> {Number(price * .0124).toLocaleString("en-US", { style: "currency", currency: "USD" })} CAD</span>
                    <Row className="my-4">
                        {optionGroup &&
                            <Col xs="auto">
                                <Form.Control as="select" value={option} style={{ display: "inherit" }}
                                    onChange={(e) => optionHandler(e.target.value)}>
                                    <option key={0} value={99}>{optionGroup}</option>
                                    {options.map((option, index) => (
                                        <option key={index} value={index}>{option.oName}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                        }
                    </Row>
                    <Row className="align-items-center mb-4">
                        <Col xs="auto">
                            <Form.Control className='form-select' as='select' value={qty} disabled={stock < 1}
                                onChange={(e) => setQty(e.target.value)}>
                                {stock >= 1 || option == 99
                                    ? [...Array(stock > 0 ? stock : 0).keys()].map(x => (
                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                    ))
                                    : <option>Out of Stock</option>
                                }
                            </Form.Control>
                        </Col >
                        <Col xs="auto">
                            <Button
                                block
                                onClick={addToCartHandler}
                                disabled={optionGroup && option == 99 || stock < 1 || missingData}
                            >Add to Cart
                            </Button>
                        </Col>
                        <Col xs="auto" className="px-2">
                            <HeartList pID={encoded} size="2x" />
                        </Col>
                    </Row>
                    <h4 className="pt-3">Description</h4>
                    {pLongDescription
                        ? <div dangerouslySetInnerHTML={{ __html: pLongDescription }} />
                        : pDescription
                            ? <div dangerouslySetInnerHTML={{ __html: pDescription }} />
                            : "No Description"
                    }
                </Col>
            </Row>
            <h4 className="text-danger my-4 pt-5">You May Also Like</h4>
            <Suggested />
        </Container>
    )
}

export default ProductScreen

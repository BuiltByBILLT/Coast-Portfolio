import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Container, Card, Form, ListGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import ProductDetailsCard from '../components/ProductDetailsCard'
import Suggested from '../components/Suggested'
import BrandFilter from '../components/BrandFilter'
import { useQuery } from 'react-query'
import axios from 'axios'

const SearchScreen = ({ history, match }) => {
    const pageNumber = match.params.pageNumber || 1
    const keyword = match.params.keyword || "ALL"
    const brands = match.params.brands || ""

    // List Query
    const { isFetching: loading, data, error, refetch } = useQuery(`productListAdmin`, () => {
        return axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}&brands=${brands}`)
    })
    const products = data && data.data && data.data.products
    const page = data && data.data && data.data.page
    const pages = data && data.data && data.data.pages

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
        refetch()
    }, [keyword, pageNumber, brands])


    return (
        <Container className="my-5 pt-5">
            {loading ? <Loader /> : error ? <Message variant='danger'>{error.response && error.response.data.message
                ? error.response.data.message : error.message}</Message>
                : (<>
                    <Row>
                        <Col xs={12} lg={3}>
                            <BrandFilter keyword={keyword} brands={brands} pageNumber={pageNumber} />
                        </Col>
                        <Col xs={12} lg={9}>
                            {products.length === 0
                                ? <Message variant='warning'>
                                    No Products Found {keyword && `that match keyword(s) \"${keyword}\"`} {brands && `under brand(s) ${brands}`}
                                </Message>
                                : <Row>
                                    {products.map(product => (
                                        <Col key={product.pID} xs='6' lg='3' className=''>
                                            <ProductDetailsCard product={product} />
                                        </Col>

                                    ))}
                                </Row>}

                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <Paginate pages={pages} page={page} location={"/search"} keyword={keyword} brands={brands} />
                        </Col>
                    </Row>
                    <h4 className="text-danger mb-4 my-5">You May Also Like</h4>
                    <Suggested />
                </>
                )}
        </Container>
    )
}

export default SearchScreen

import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import ProductDetailsCard from '../components/ProductDetailsCard'
import Suggested from '../components/Suggested'

const SearchScreen = ({ history, match }) => {
    const pageNumber = match.params.pageNumber || 1
    const keyword = match.params.keyword || ""

    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList


    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber, 16))
    }, [])

    return (
        <Container className="my-5 pt-5">
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                : (<>
                    <Row>
                        <Col xs={12} lg={3}>

                        </Col>
                        <Col xs={12} lg={9}>
                            <Row>
                                {products.map(product => (
                                    <Col key={product.pID} xs='6' lg='3' className=''>
                                        <ProductDetailsCard product={product} />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                    <h4 className="text-danger mb-4 my-5">You May Also Like</h4>
                    <Suggested />
                    <Row>
                        <Col xs={6} style={{ wordWrap: "break-word" }}>
                            <Paginate pages={pages} page={page} isAdmin={true} />
                        </Col>
                    </Row>
                </>
                )}
        </Container>
    )
}

export default SearchScreen

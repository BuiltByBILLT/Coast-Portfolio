import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCategoryDetails, getCategoryProducts } from '../actions/categoryActions'

import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { Row, Col, Image, Breadcrumb, Container } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Suggested from '../components/Suggested'
import BreadCrumbs from '../components/BreadCrumbs'
import ProductDetailsCard from '../components/ProductDetailsCard'
import CategoryCard from '../components/CategoryCard'


const CategoryScreen = ({ match }) => {
    const categoryId = match.params.id
    const { loading, error, category } = useSelector(state => state.categoryDetails)
    const { loading: loadingProducts, error: errorProducts, products } = useSelector(state => state.categoryProducts)

    const dispatch = useDispatch()
    useEffect(() => {

        dispatch(getCategoryDetails(match.params.id))
        dispatch(getCategoryProducts(match.params.id))

        return () => { }
    }, [dispatch, match])

    return (
        <Container className="my-5">
            {loading || loadingProducts ? <Loader /> : error ? (<Message variant='danger'>{error}</Message>)
                : (<>
                    <BreadCrumbs category={category} />


                    {category.children && category.children.length ? (
                        <Row>
                            {category.children.map(child => (
                                <Col key={child.sectionID} xs='6' lg='3' className='p-4'>
                                    <CategoryCard category={child} />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <>
                            {products && products.length ? (
                                <>
                                    <Row>
                                        {products.map(product => (
                                            <Col key={product.pID} xs='6' lg='3' className=''>
                                                <ProductDetailsCard product={product} />
                                            </Col>
                                        ))}
                                    </Row>
                                </>
                            ) : (
                                <Message variant="warning" className="text-danger mb-5">No products to show</Message>
                            )}
                            <h4 className="text-danger mb-4 my-5">You May Also Like</h4>
                            <Suggested />
                        </>

                    )

                    }

                </>)
            }

        </Container>
    )
}

export default CategoryScreen

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { getSuggestedProducts } from '../actions/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import ProductSimpleCard from './ProductSimpleCard'

const Suggested = () => {

    const { loading, error, suggested } = useSelector(state => state.productSuggested)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getSuggestedProducts())
    }, [dispatch])

    return (
        <>
            {error ? (<Message variant='danger'>{error}</Message>)
                : suggested && (
                    <Row>
                        {suggested.map(product => (
                            <Col key={product.pID} xs='6' lg='3' className='px-4'>
                                <ProductSimpleCard product={product} />
                            </Col>
                        ))}
                    </Row>
                )
            }
        </>
    )
}

export default Suggested

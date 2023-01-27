import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { getSuggestedProducts } from '../actions/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import ProductSimpleCard from './ProductSimpleCard'
import axios from 'axios'
import { useQuery } from 'react-query'

const Suggested = () => {

    // const { loading, error, suggested } = useSelector(state => state.productSuggested)
    // const dispatch = useDispatch()
    // useEffect(() => {
    //     dispatch(getSuggestedProducts())
    // }, [dispatch])

    const { data } = useQuery(`suggested`, () =>
        axios.get(`/api/products/suggested`)
    )
    const suggested = data?.data

    if (!suggested) return null
    return (
        <Row>
            {suggested.map(product => (
                <Col key={product.pID} xs='6' lg='3' className='px-4'>
                    <ProductSimpleCard product={product} />
                </Col>
            ))}
        </Row>
    )
}

export default Suggested

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getSuggestedProducts } from '../actions/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import ProductSimpleCard from './ProductSimpleCard'

const TopThree = () => {

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
                        {suggested.slice(1).map(product => (
                            <Col key={product.pID} xs='6' lg='4' className='px-5'>
                                <Link to={`/product/${product.pID}`} className="linkBox">
                                    <div className="mb-5 productSimpleCard">
                                        <Image className="" style={{ width: "100%", height: "250px", objectFit: "contain" }}
                                            src={product.images && product.images[0] ? "https://www.coastairbrush.com/" + product.images[0].imageSrc
                                                : "/images/sample.jpg"}
                                        />
                                        <h5 className="text-center mt-4 text-danger px-4">
                                            {product.pName}
                                        </h5>
                                        <div className="overlay">
                                            <Button className="middle">See More</Button>
                                        </div>
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                )
            }
        </>
    )
}

export default TopThree

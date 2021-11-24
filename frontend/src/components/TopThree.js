import React from 'react'
import { Row, Col, Image, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Message from '../components/Message'
import { envImage, firstImage } from '../common'
import { useQuery } from 'react-query'
import axios from 'axios'

const TopThree = () => {

    // Query: Product Details  
    const { data, error } = useQuery(["suggested"], () => {
        return axios.get(`/api/products/suggested`)
    })
    const suggested = data && data.data && data.data.slice(1)

    return (
        <>
            {error
                ? (<Message variant='danger'>{error.response && error.response.data.message
                    ? error.response.data.message : error.message}
                </Message>)
                : suggested &&
                (<Row>
                    {suggested.map(product => (
                        <Col key={product.pID} xs='6' lg='4' className='px-5'>
                            <Link to={`/product/${product.pID}`} className="linkBox">
                                <div className="mb-5">
                                    <Image className="" style={{ width: "100%", height: "250px", objectFit: "contain" }}
                                        src={envImage(firstImage(product))} />
                                    <h5 className="text-center mt-4 px-4">
                                        {product.pName}
                                    </h5>
                                    <h5 className="text-center text-danger px-4">
                                        {product.pPrice
                                            ? Number(product.pPrice / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
                                            : "See Options"
                                        }
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

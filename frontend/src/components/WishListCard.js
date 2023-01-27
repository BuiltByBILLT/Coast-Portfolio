import React from 'react'
import { Link } from 'react-router-dom'
import { Image, Button, Row, Col } from 'react-bootstrap'
import "../styles/Cards.css"
import { useQuery } from 'react-query'
import axios from 'axios'
import { HeartList } from './HeartList'
import { envImage, firstImage } from '../common'


const WishListCard = ({ pID }) => {

    const { isLoading, isError, data, error } = useQuery(pID, () =>
        axios.get(`/api/products/details/${pID}`))
    const product = data && data.data


    return (
        // <p>{JSON.stringify(product)}</p>
        <>
            {product &&
                <Link to={`/product/${pID}`} className="linkBox">
                    <div className="mb-5 productDetailsCard">
                        <p className="bg-danger text-light text-center py-1 mb-2">
                            {"Product ID " + product.pID}
                        </p>
                        <Image className="px-2" style={{ width: "100%", height: "200px", objectFit: "contain" }}
                            src={envImage(firstImage(product))}
                        />
                        <p className="text-center mt-4">
                            {product.pName}
                        </p>
                        <Row className="px-4 mb-3">
                            <Col className="p-0">
                                <h5 className="text-center text-danger m-0">
                                    {product.pPrice
                                        ? Number(product.pPrice / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
                                        : "See Options"
                                    }
                                </h5>
                            </Col>
                            <Col xs="auto" className="px-2 my-auto">
                                {/* <i className='far fa-heart fa-1x text-danger'></i> */}
                                <HeartList pID={pID} size="1x" />
                            </Col>
                        </Row>
                    </div>
                </Link>
            }
        </>
    )
}

export default WishListCard

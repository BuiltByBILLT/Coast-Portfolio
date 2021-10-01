import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Image, Breadcrumb } from 'react-bootstrap'
import Rating from './Rating'
import "../styles/Cards.css"

const ProductDetailsCard = ({ product }) => {
    return (
        <Link to={`/product/${product.cloverID}`} className="linkBox">
            <div className="mb-5 productDetailsCard">
                <p className="bg-danger text-light text-center py-1 mb-2">
                    {"Product ID " + product.pID}
                </p>
                <Image className="px-2" style={{ width: "100%", height: "200px", objectFit: "contain" }}
                    src={product.images && product.images[0] ? "https://www.coastairbrush.com/" + product.images[0].imageSrc
                        : "/images/sample.jpg"}
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
                        <i className='far fa-heart fa-1x text-danger'></i>
                    </Col>
                </Row>
            </div>
        </Link>
    )
}

export default ProductDetailsCard

import axios from 'axios'
import React, { useEffect, useRef } from 'react'
import { Col, Container, ListGroup, ListGroupItem, Nav, Row } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'

const BrandsScreen = ({ match }) => {

    const { isLoading, data, refetch } = useQuery('brandList', () => {
        return axios.get(`/api/brands`)
    })
    const brands = data && data.data
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
        "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]


    const myRef = useRef([]);


    return (
        <Container className="my-5 pt-3 px-lg-5">
            <div className="pb-4 border-bottom">
                {letters.map((letter, index) => (
                    <LinkContainer to={'#' + letter} active={false} style={{ color: "#fed815", display: "inline", cursor: "pointer", }}>
                        <h1 className="textShadow"
                            onClick={() => myRef.current[index].scrollIntoView()}
                        >{letter} </h1>
                    </LinkContainer>
                ))}
            </div>

            <ListGroup variant="flush">
                {letters.map((letter, index) => (
                    <ListGroupItem key={letter} className="py-4">
                        <h1 className="text-danger mb-3" ref={el => myRef.current[index] = el}>{letter}</h1>
                        <Row>
                            {brands && brands.filter(brand => brand.brandName[0] === letter).map(brand => (
                                <Col xs={4} className="my-1">
                                    <LinkContainer to={"/search/" + "ALL" + "/page/" + 1 + "/brands/" + brand.brandID}>
                                        <Link active={false} className="px-0">
                                            {brand.brandName}
                                        </Link>
                                    </LinkContainer>
                                </Col>
                            ))}
                        </Row>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </Container >
    )
}

export default BrandsScreen

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

const SearchScreen = ({ history, match }) => {
    const pageNumber = match.params.pageNumber || 1
    const keyword = match.params.keyword || ""

    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList

    const [filter, setFilter] = useState([])

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber, 20, "updatedAt", -1, 0))
    }, [keyword])

    const addBrand = (e) => {
        // alert("Added " + e)
        setFilter(arr => [...arr, e])
    }
    const removeBrand = (e) => {
        // alert("Removed " + e)
    }

    useEffect(() => {
        console.log(filter)
    }, [filter])

    return (
        <Container className="my-5 pt-5">
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                : (<>
                    <Row>
                        <Col xs={12} lg={3}>
                            <Card>
                                <Card.Header as="h5">Filter by Brand</Card.Header>
                                <ListGroup variant="flush" className="my-2 border-0">
                                    {[
                                        "Advantage Refinish Products",
                                        "Air Gunsa",
                                        "Airbrush Action",
                                        "Alpha 6",
                                        "Aqua Flow",
                                        "Artograph",
                                        "Artool",
                                        "Auto Air",
                                        "Auto Air candy2O",
                                        "Auto Borne",
                                        "Aztek",
                                        "Badger",
                                        "California Air Tools",
                                        "Coast Airbrush",
                                        "Comart",
                                        "Createx",
                                        "Createx Colors Illustration Colors",
                                        "DeVilbiss",
                                        "DH Woodworks",
                                        "Dry Air Systems",
                                        "Dura-Block",
                                        "EBA",
                                        "Excel",
                                        "FBS Tapes & Sprayers",
                                        "Flake King",
                                        "Freak Flex",
                                        "Graftobian",
                                        "Grex",
                                        "HB Bodyworks",
                                        "Holbein Aeroflash",
                                        "House of Kolor",
                                        "House of Kolor Aerosols",
                                        "House of Kolor Shimrin 2",
                                        "Iwata Medea",
                                        "JAtech",
                                        "KopyKake",
                                        "La D'ore",
                                        "Lil Daddy Roth Flake",
                                        "LumaIII",
                                        "Lumilor",
                                        "Mack",
                                        "Mad Fabricators",
                                        "Medea Textile acrylic",
                                        "Meguiar's",
                                        "Old School Flake",
                                        "One Shot",
                                        "Paasche",
                                        "Preval",
                                        "Pro Aiir Body Paints",
                                        "Sata",
                                        "Sharpen Air",
                                        "Silentaire",
                                        "Spray Max",
                                        "System 51",
                                        "Tamiya",
                                        "Temptu",
                                        "Trulers",
                                        "Vintage Flatz",
                                        "Virtus",
                                        "VsionAir",
                                        "Wicked",
                                        "Xtreme",
                                    ].map((brand) => (
                                        <ListGroup.Item key={brand} className="py-1 border-0">
                                            <Form.Check type="checkbox" value={brand} label={brand}
                                                onChange={(e) => e.target.checked ? addBrand(e.target.value) : removeBrand(e.target.value)}
                                            ></Form.Check>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <Button variant="danger">
                                    Filter
                                </Button>
                            </Card>
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

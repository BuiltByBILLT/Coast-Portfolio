import React, { useEffect } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import Suggested from '../components/Suggested'

import { useDispatch, useSelector } from 'react-redux'
import { listProducts, resetProducts } from '../actions/productActions'

import "../styles/HomeScreen.css"
import TopThree from '../components/TopThree'
import CategoryCard from '../components/CategoryCard'
import { getTopCategories } from '../actions/categoryActions'


const HomeScreen = ({ match }) => {

    // const { loading, error, products, page, pages } = useSelector(state => state.productList)
    const { top } = useSelector(state => state.categoryTop)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getTopCategories())

    }, [dispatch])

    return (
        <>
            <Meta />
            <div className="homePage">
                <Row className="hero">
                    <Container >
                        <Col lg={5}>
                            <div className="bg-danger heroText">
                                <h2>Takes One to Know One</h2>
                                <p className="text-light">Here at Coast, we are one big family of artists who love to create and serve our communit as best we can</p>
                            </div>
                        </Col>
                    </Container>
                </Row>
                <Row className="featured" >
                    <Container>
                        <Row className="pb-5">

                            <Col lg={6}>
                                <Image src="https://www.coastairbrush.com/prodimages/K9200smw.png"
                                    style={{ width: "100%" }}
                                    className="px-5" />
                            </Col>
                            <Col lg={6} >
                                <h2 className="mt-5 mt-lg-0 text-danger">Featured Product</h2>
                                <h3 className="mt-3" style={{ letterSpacing: "0px" }}>IWATA Airbrush</h3>
                                <p className="">Grab your Iwata HP-TH2 Gravity Feed Dual Action Trigger Airbrush while the vault is still open</p>
                                <Button>Shop Now</Button>
                            </Col>
                        </Row>
                        <h1 className="text-center text-danger mb-3">Top Products</h1>
                        <TopThree />
                    </Container>
                </Row >
                <Row className="topCat">
                    <Container >
                        {top && (
                            <Row>
                                {top.slice(0, 4).map(child => (
                                    <Col key={child.sectionID} xs='6' lg='3' className='p-4'>
                                        <CategoryCard category={child} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                        <h1 className="text-center text-danger mb-3">Top Categories</h1>
                        {top && (
                            <Row>
                                {top.slice(4, 8).map(child => (
                                    <Col key={child.sectionID} xs='6' lg='3' className='p-4'>
                                        <CategoryCard category={child} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Container>
                </Row>
                <Row className="topBrands" >
                    <Container>
                        {top && (
                            <Row>
                                {top.slice(8, 12).map(child => (
                                    <Col key={child.sectionID} xs='6' lg='3' className='p-4'>
                                        <CategoryCard category={child} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                        <h1 className="text-center mb-3">Top Brands</h1>
                        {top && (
                            <Row>
                                {top.slice(12, 16).map(child => (
                                    <Col key={child.sectionID} xs='6' lg='3' className='p-4'>
                                        <CategoryCard category={child} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Container>
                </Row>
                <Container className="pt-5 pb-3">
                    <h5>Not Sure Where To Start?</h5>
                    <h3 className="text-danger mb-4">Watch Our Training Videos</h3>
                    <Row>
                        <Col lg={4}>
                            <Image src="http://www.coastairbrushtv.com/thumbnail.asp?file=assets/images/thmbwoodgrain2.png&maxx=0&maxy=150"
                                style={{ width: "100%" }} />
                            <h5 className="mt-3 mb-0 text-center text-danger">Lucky FX Woodgraining </h5>
                            <p className="text-center">with Ryno</p>
                        </Col>
                        <Col lg={4}>
                            <Image src="http://www.coastairbrushtv.com/thumbnail.asp?file=assets/images/thmbrccar1.png&maxx=0&maxy=150"
                                style={{ width: "100%" }} />
                            <h5 className="mt-3 mb-0 text-center text-danger">Race Ready RC Car Painting </h5>
                            <p className="text-center">with Charlie Barnes</p>
                        </Col>
                        <Col lg={4}>
                            <Image src="http://www.coastairbrushtv.com/thumbnail.asp?file=assets/images/thmbTHOR.png&maxx=0&maxy=150"
                                style={{ width: "100%" }} />
                            <h5 className="mt-3 mb-0 text-center text-danger">Organic Texture & Dynamic Lighting </h5>
                            <p className="text-center">with Cory Saint Clair</p>
                        </Col>
                    </Row>
                </Container>
                <Row className="seeDave">
                    <Container >
                        <Row className="pb-5 mb-5" >
                            <Col lg={7}>
                            </Col>
                            <Col lg={5} >
                                <h3 className="" style={{ letterSpacing: "0px" }}>Look Familiar?</h3>
                                <h2 className="mt-5 mt-lg-0 text-danger">See David On</h2>
                                <p className="text-dark">Grab your Iwata HP-TH2 Gravity Feed Dual Action Trigger Airbrush while the vault is still open</p>
                                <div className="ml-auto">
                                    <Button>Shop Now</Button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Row>
                <Row className="favorites">
                    <Container>
                        <Row className="mb-5">
                            <Col lg={5}>
                                <div className="bg-danger favoriteText">
                                    <h2 className="text-white m-0">David's Favorites</h2>
                                </div>
                            </Col>
                        </Row>
                        <TopThree />
                    </Container>
                </Row>
                <Row className="instagram">
                    <Container >
                        <h3 className="text-white mt-3">Instagram</h3>
                    </Container>
                </Row>
                <Row className="location">
                    <Container >
                        <Row>
                            <Col lg={6} className="my-5 mt-lg-0">
                            </Col>
                            <Col lg={3} className="my-5 mt-lg-0 text-center text-lg-left">
                                <h3 className="text-danger">Location</h3>
                                <p>blah blah blah blah blah blah blah blah blah blah blah blah </p>
                                <br />
                                <p>312 N Anaheim Blvd.</p>
                                <p>Anahiem CA 92805</p>
                                <br />
                                <p>714-635-5557</p>
                                <br />
                                <p>kustom@coastairbrush.com</p>
                            </Col>
                            <Col lg={3} className="my-5 mt-lg-0 text-center text-lg-left">
                                <h3 className="text-danger">Hours</h3>
                                <p>Mon, Fri, Sat:</p>
                                <p>9:30am - 5:00pm</p>
                                <br />
                                <p>Tues, Wed, Thur:</p>
                                <p>9:30am - 6:00pm</p>
                                <br />
                                <p>CLOSED SUNDAYS</p>
                            </Col>
                        </Row>
                    </Container>
                </Row>
            </div >
        </>
    )
}

export default HomeScreen

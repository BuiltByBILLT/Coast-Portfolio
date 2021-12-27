import React, { useEffect } from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Meta from '../components/Meta'

import { useDispatch, useSelector } from 'react-redux'

import "../styles/HomeScreen.css"
import TopThree from '../components/TopThree'


const HomeScreen = ({ match }) => {

    // const { loading, error, products, page, pages } = useSelector(state => state.productList)
    const { top } = useSelector(state => state.categoryTop)

    const dispatch = useDispatch()
    useEffect(() => {
        // window.scrollTo({ top: 0, behavior: "smooth" });
        // dispatch(getTopCategories())

    }, [dispatch])

    return (
        <>
            <Meta />
            <div className="homePage">
                <Row className="mx-0" style={{
                    backgroundImage: "url('/static/hero_image_only.png')",
                    // backgroundSize: "100% 100%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "600px",
                    marginTop: "-2px"
                }}>
                    <Container className=""
                        style={{
                            backgroundImage: "url('/static/Hero_Headline.png')",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "contain",
                            height: "320px",
                            fontSize: "13px",
                            paddingTop: "210px",
                            paddingLeft: "50px",
                            marginTop: "150px",
                        }}>
                        <p className="text-light"
                            style={{ width: "350px" }}>
                            Here at Coast, we are one big family of artists who love to create and serve our communit as best we can</p>
                    </Container>
                </Row>
                <div style={{ position: "absolute", width: "100vw" }}>
                    <Image src="/static/texture1_only.png"
                        style={{ height: "80px", position: "absolute", top: "-35px", left: "-50px", zIndex: 5 }}></Image>
                </div>

                <Row className="featured mx-0" style={{ backgroundImage: "url('/static/BG_Featured_section.png')" }} >
                    <Container>
                        <Row className="pb-5">

                            <Col lg={6}>
                                <Image src="/static/airbrush_withframe.png"
                                    style={{ width: "100%" }}
                                    className="px-5" />
                            </Col>
                            <Col lg={6} >
                                <h2 className="mt-5 text-danger">Featured Product</h2>
                                <h3 className="mt-3" style={{ letterSpacing: "0px" }}>IWATA Airbrush</h3>
                                <p className="pr-5">Grab your Iwata HP-TH2 Gravity Feed Dual Action Trigger Airbrush while the vault is still open</p>
                                {/* <Link to={`/product/DKTX81PVDX2C6`}  > */}
                                <Link to={`/products`}  >
                                    <Button>Shop Now</Button>
                                </Link>
                            </Col>
                        </Row>
                        <h1 className="text-center text-danger mb-5">Top Products</h1>
                        <TopThree className="my-5" />
                    </Container>
                </Row >
                <Row className="topCat">
                    <Container>
                        {
                            <Row className="my-5">
                                {[
                                    { name: "Makeup/Beauty", url: "607", image: "/static/Makeup.png" },
                                    { name: "Automobile", url: "20", image: "/static/Automobile.png" },
                                    { name: "Fine Arts", url: "22", image: "/static/FineArts.png" },
                                    { name: "T-Shirts", url: "383", image: "/static/Tshirts.png" }
                                ].map(card => (
                                    <Col key={card.name} xs='6' lg='3' className='p-4'>
                                        <Link to={`/category/${card.url}`} className="linkBox" >
                                            <Image
                                                className="mx-auto px-2"
                                                style={{ width: "100%", height: "200px", objectFit: "contain" }}
                                                src={card.image}
                                            />
                                            <h5 className="redTextHover text-center my-4">{card.name}</h5>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        }
                        <h1 className="text-center text-danger mb-3">Top Categories</h1>
                        {
                            <Row className="my-5">
                                {[
                                    { name: "Leafing/Pinstripe", url: "21", image: "/static/Pinstripe.png" },
                                    { name: "Hobby", url: "0", image: "/static/Hobby.png" },
                                    { name: "Mural", url: "589", image: "/static/Mural.png" },
                                    { name: "Model", url: "404", image: "/static/Model.png" }
                                ].map(card => (
                                    <Col key={card.name} xs='6' lg='3' className='p-4'>
                                        <Link to={`/category/${card.url}`} className="linkBox" >
                                            <Image
                                                className="mx-auto px-2"
                                                style={{ width: "100%", height: "200px", objectFit: "contain" }}
                                                src={card.image}
                                            />
                                            <h5 className="redTextHover text-center my-4">{card.name}</h5>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        }
                    </Container>
                </Row>
                <Row className="topBrands mx-0" >
                    <Container>
                        {
                            <Row className="my-5">
                                {[
                                    { image: "/static/kolor.png" },
                                    { image: "/static/Iwata.png" },
                                    { image: "/static/3m.png" },
                                    { image: "/static/CreateXColors.png" }
                                ].map(card => (
                                    <Col key={card.image} xs='6' lg='3' className='p-4 text-center'>
                                        <Link to={`/brands`} className="linkBox" >
                                            <Image
                                                className="mx-auto yellowBorderHover"
                                                style={{ width: "200px", height: "200px", objectFit: "contain", padding: "0px" }}
                                                src={card.image}
                                            />
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        }
                        <h1 className="text-center mb-3">Top Brands</h1>
                        {
                            <Row className="my-5">
                                {[
                                    { image: "/static/Lumilor.png" },
                                    { image: "/static/Paasche.png" },
                                    { image: "/static/1shot.png" },
                                    { image: "/static/MissionModels.png" }
                                ].map(card => (
                                    <Col key={card.image} xs='6' lg='3' className='p-4 text-center'>
                                        <Link to={`/brands`} className="linkBox" >
                                            <Image
                                                className="mx-auto yellowBorderHover"
                                                style={{ width: "200px", height: "200px", objectFit: "contain", padding: "0px" }}
                                                src={card.image}
                                            />
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        }
                    </Container>
                </Row>
                <Container className="mt-5 pt-4 pb-3">
                    <h6>Not Sure Where To Start?</h6>
                    <h3 className="text-danger mb-4">Watch Our Training Videos</h3>
                    <Row className="my-5">
                        <Col lg={4}>
                            <Link to={`https://www.youtube.com`} className="linkBox" >
                                <Image src="/static/Video_mixing.png"
                                    style={{ width: "100%" }} >
                                </Image>
                                <h5 className="mt-3 mb-0 text-center text-danger">Mixing the House of Kolor Urethanes </h5>
                                <p className="text-center">With Dave Monning</p>
                                <div className="overlayYellow">
                                    <Button className="middle">Watch Video</Button>
                                </div>
                            </Link>

                        </Col>
                        <Col lg={4}>
                            <Link to={`https://www.youtube.com`} className="linkBox" >
                                <Image src="/static/Vide_airbrush.png"
                                    style={{ width: "100%" }} />
                                <h5 className="mt-3 mb-0 text-center text-danger">Airbrush Overview </h5>
                                <p className="text-center">with Dave Monning</p>
                                <div className="overlayYellow">
                                    <Button className="middle">Watch Video</Button>
                                </div>
                            </Link>
                        </Col>
                        <Col lg={4}>
                            <Link to={`https:www.youtube.com`} className="linkBox" >
                                <Image src="/static/Video_FlamingSkull.png"
                                    style={{ width: "100%" }} />
                                <h5 className="mt-3 mb-0 text-center text-danger">The "Flaming" Skull</h5>
                                <p className="text-center">Creating Skulls & Realistic Blue Fire w/ Craig Fraser</p>
                                <div className="overlayYellow">
                                    <Button className="middle">Watch Video</Button>
                                </div>
                            </Link>
                        </Col>
                    </Row>
                </Container>
                <Row className="seeDave mx-0" style={{ backgroundImage: "url('/static/David_Section_BG.png')", height: "600px" }}>
                    <Col lg={8} className="d-none d-lg-block"
                        style={{
                            backgroundImage: "url('/static/David.png')",
                            backgroundSize: "cover"
                        }}>
                    </Col>
                    <Col lg={4} className="px-4 my-5">
                        <h3 className="" style={{ letterSpacing: "0px" }}>Look Familiar?</h3>
                        <h2 className="mt-5 mt-lg-0 mb-4 text-danger">See David On</h2>
                        <Image src="/static/Asset32.png" style={{ width: "30%" }} />
                        <Image src="/static/Asset33.png" style={{ width: "30%" }} className="mx-2" />
                        <Image src="/static/Asset34.png" style={{ width: "30%" }} />
                        <p className="text-dark my-5">Grab your Iwata HP-TH2 Gravity Feed Dual Action Trigger Airbrush while the vault is still open</p>
                        <div className="ml-auto">
                            <Button>Shop Now</Button>
                        </div>
                    </Col>
                </Row>
                <Row className="favorites mb-5 pt-5 mx-0"
                    style={{ position: "relative" }}>
                    <Image src="/static/texture1_only.png"
                        style={{ height: "80px", position: "absolute", top: "-20px", left: "-50px", zIndex: 5 }}>

                    </Image>
                    <Image src="/static/David_Favorite.png"
                        style={{ height: "120px", position: "absolute", top: "10px", left: "50px", zIndex: 5 }}>

                    </Image>
                    <Container className="mt-5 pt-5">
                        <TopThree />
                    </Container>
                </Row>
                <Row className="instagram mx-0" style={{ height: "600px" }}>
                    {/* <Row className="instagram mx-0"> */}
                    <Container >
                        <h3 className="text-white my-3">Instagram</h3>
                        <div className="elfsight-app-d248b7bd-2728-4b1a-ba26-babd662f3e41 mx-auto"></div>
                    </Container>
                </Row>
                <Row className="location mx-0">
                    <Container >
                        <Row>
                            <Col lg={6} className="my-5 mt-lg-0">
                                <a href="https://goo.gl/maps/AS8oMq7AFMnaX67R6" target='_blank'>
                                    <Image src="/static/Map.png"
                                        style={{ width: "100%", paddingRight: "60px", cursor: "pointer" }}
                                    />
                                </a>
                            </Col>
                            <Col lg={4} className="my-5 mt-lg-0 text-center text-lg-left pl-0">
                                <h3 className="text-danger mb-4">Contact Us</h3>
                                <i className="fas fa-map-marker-alt"></i>
                                <span className="ml-3 mb-0 font-weight-bold">312 N Anaheim Blvd.</span>
                                <p className="font-weight-bold" style={{ marginLeft: "28px" }}>Anahiem CA 92805</p>
                                <i className="fas fa-phone-alt"></i>
                                <span className="ml-3 font-weight-bold">714-635-5557</span>
                                <br />
                                <br />
                                <i className="fas fa-envelope"></i>
                                <a href="kustom@coastairbrush.com" className="ml-3 font-weight-bold"
                                    style={{ color: "#55595c" }}
                                >kustom@coastairbrush.com</a>
                            </Col>
                            <Col lg={2} className="my-5 mt-lg-0 text-center text-lg-left px-0">
                                <h3 className="text-danger mb-3">Hours</h3>
                                <p className="font-weight-bold mb-0">Mon, Fri, Sat:</p>
                                <p>9:30am - 5:00pm</p>
                                <p className="font-weight-bold mb-0">Tues, Wed, Thur:</p>
                                <p>9:30am - 6:00pm</p>
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

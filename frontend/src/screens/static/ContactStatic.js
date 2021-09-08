import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import "../../styles/Static.css"

const ContactStatic = () => {
    return (
        <>
            <Row className="" style={{
                backgroundImage: "url('/images/Hero_Photo3.png')",
                // backgroundSize: "100% 100%",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "700px",
                marginTop: "-2px"
            }}>
                <Container className=""
                    style={{
                        backgroundImage: "url('/images/Hero_Headline3.png')",
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
                <Image src="/images/texture1_only.png"
                    style={{ height: "80px", position: "absolute", top: "-25px", left: "-0px", zIndex: 5 }}></Image>
            </div>
            <Row className="my-5 pt-5">
                <Container >
                    <Row>
                        <Col lg={6} className="my-5 mt-lg-0">
                            <Image src="/images/Map.png"
                                style={{ width: "100%", paddingRight: "60px" }} />
                        </Col>
                        <Col lg={4} className="my-5 mt-lg-0 text-center text-lg-left">
                            <h3 className="text-danger">Contact Us</h3>
                            <p>lorem ipsum dolor sit amet, consecte adipiscing elit, sed diam laoreet</p>
                            <i className="fas fa-map-marker-alt"></i>
                            <span className="ml-3 mb-0 font-weight-bold">312 N Anaheim Blvd.</span>
                            <p className="font-weight-bold" style={{ marginLeft: "28px" }}>Anahiem CA 92805</p>
                            <i className="fas fa-phone-alt"></i>
                            <span className="ml-3 font-weight-bold">714-635-5557</span>
                            <br />
                            <br />
                            <i className="fas fa-envelope"></i>
                            <span className="ml-3 font-weight-bold">kustom@coastairbrush.com</span>
                        </Col>
                        <Col lg={2} className="my-5 mt-lg-0 text-center text-lg-left">
                            <h3 className="text-danger">Hours</h3>
                            <p className="font-weight-bold mb-0">Mon, Fri, Sat:</p>
                            <p>9:30am - 5:00pm</p>
                            <p className="font-weight-bold mb-0">Tues, Wed, Thur:</p>
                            <p>9:30am - 6:00pm</p>
                            <p>CLOSED SUNDAYS</p>
                        </Col>
                    </Row>
                </Container>
            </Row>
            <Row>
                <Container className="mb-5 pb-5">
                    <h3 className="mb-4">Connect With Us</h3>
                    <i className="mr-5 fab fa-facebook-square fa-4x"></i>
                    <i className="mr-5 fab fa-youtube fa-4x"></i>
                    <i className="mr-5 fab fa-twitter fa-4x"></i>
                    <i className="mr-5 fab fa-pinterest fa-4x"></i>
                    <i className="mr-5 fab fa-instagram fa-4x"></i>
                </Container>
            </Row>
        </>
    )
}

export default ContactStatic
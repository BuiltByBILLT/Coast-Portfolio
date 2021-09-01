import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import "../../styles/Static.css"

const AboutStatic = () => {
    return (
        <>
            <Row className="" style={{
                backgroundImage: "url('/images/Photo_together2.png')",
                // backgroundSize: "100% 100%",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "700px",
                marginTop: "-2px"
            }}>
                <Container className=""
                    style={{
                        backgroundImage: "url('/images/Hero_Headline.png')",
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
            {/* <Container className="py-5"> */}
            <Row>
                <Col className="mr-5  pr-0 pl-5 pt-5"
                    style={{ backgroundImage: "linear-gradient(135deg,rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.4)" }}
                >
                    <Image src="/images/Photo_top.png" style={{ width: "100%", paddingBottom: "20px" }} />
                    <Image src="/images/Photo_middle.png" style={{ width: "100%", paddingBottom: "20px" }} />
                    <Image src="/images/Photo_Bottom.png" style={{ width: "100%", paddingBottom: "20px" }} />
                </Col>
                <Col className="pt-5 pr-5 mr-5">
                    <h1 className="text-danger mb-5">Our Story</h1>
                    <p>
                        Coast Airbrush was founded in 1989 by Frank Monnig.  Frank who once worked for Pacific Airbrush sought to trust his own business instincts and started up his own airbrush specialty store.  Frank called his new store Coast Airbrush and located his business up the street in a very cozy little store space that fronted his brothers mechanic garage.  Frank grew the business and with it came friends that supported him.  Frank would let any airbrush artist display their work in the store if they were courageous enough to show it.  After awhile a tremendous amount to Artist's began to hang thier work and covered every square inch of the store. This created a sense of belonging and pride to returning artists to show off their work to friends or just to replenish airbrush supplies and see other artists being added.  You could always count on Frank to tell you a funny joke or to show you a brand new airbrush with a wizardly glee.            </p>
                    <p>
                        The experienced airbrush artists were willing to share tips & techniques with anyone interested in learning to airbrush and Frank initiated the 1st Annual Coast Airbrush Party........An event that started out in September 1990 as 15-20 airbrush artists showing off their talents and their artworks together under one big tent so to speak.  A nominal cover charge let the public experience some of California's hottest and upcoming airbrush artists and a few star sightings.  The Coast Airbrush Parties continued for the next 8 years and eventually got so big they had to move it to the O.C. Fairgrounds.
                    </p>
                    <p>
                        It was during the Coast Airbrush Parties that you could see Frank sons Dave, Doug and Chris to help out in the festivities.  Franks sons initially saw the Coast Airbrush Store somewhere they had to go as youngsters to work for free for dad.  Dad as they say knows best and dad liked to Party!  For those of you did not have the opportunity to have experienced a Coast Airbrush Party in the 8 years it ran you missed a routy party every year with live entertainment, huge demonstrations, stories and intrique that will live in infamy.  Frank and his family suffered a devastating loss when his son Doug passed away unexpectedly.  The outpouring of love from the new airbrush community that Frank cultivated was legendary.  Since Doug was a huge part of developing the Coast Airbrush specialty store with his brothers and father it was unclear if it would continue.
                    </p>
                    <p>
                        Franks son Dave Monnig emerged to take on the reins of Coast Airbrush and had some of his own business ideas to run the show.  Dave would bring the Coast Airbrush Party to a whole new level.  Dave with his soon to be wife Raina and a lot of longtime friends from Coast would orchestrate these massive Coast Airbrush parties at nearby hotels.  The event got so big that eventually they had to move the party to the O.C. Fairgrounds convention center.  Dave and Raina married and had a beautiful bay girl Taylor. Raising a newborn and managing the huge events began to be too much and the Coast Airbrush Parties took a break.  You'll frequently see Franks son Chris working with Dave in a big convention or trade show. Chris married Paula and had beautiful baby boy and named him Doug to honor his brother.
                    </p>
                    <p>
                        Dave moved Coast Airbrush to a huge warehouse just down the street again painted the walls and established his new presence again with the 1st Annual Kustom Kulture Show.  An event held in Coast Airbrushes backyard like the old time Coast Airbrush Party days but with a new twist.
                    </p>
                    <p>
                        Dave capitalized on the popularity of the new Monster Garage and the renaissance of the Kustom Klassics and invited the top automotive graphic artists and custom fabricators with impressive displays of showcars and motorcycles customized with phenomenal airbrush work and pinstriping.
                    </p>
                    <p>
                        Already having 8 Kustom Kulture shows under their belts Coast Airbrush is just getting started.  The collective energy and passion you can feel when you visit the store invoke confidence and creativity that you can do anything.  More of everything in the store and online orders shipping to everywhere in the world, you can tell they are on a roll.  Coast Airbrush updated their website in 2006 to reflect their aggressive marketing campaigns and continue to do so daily. Welcome back to those of you have started with us form the beginning and to those of you who have just come to know the Coast Airbrush experience!
                    </p>
                </Col>
            </Row>
            {/* </Container> */}
        </>
    )
}

export default AboutStatic

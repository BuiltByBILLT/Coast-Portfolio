import React from 'react'
import { Container, Row } from 'react-bootstrap'
import InstagramFeed from '../components/InstagramFeed'

const TestScreen = () => {
    return (
        <Row className=" mx-0">
            <Container >
                <h3 className="text-white my-3">Instagram</h3>
                <InstagramFeed />
            </Container>
        </Row>
    )
}

export default TestScreen

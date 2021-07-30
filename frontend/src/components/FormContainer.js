import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const FormContainer = ({ children }) => {
    return (
        <Container>
            <Row className='justify-content-lg-center'>
                <Col lg={7} xl={5}>
                    {children}
                </Col>

            </Row>
        </Container>
    )
}


export default FormContainer

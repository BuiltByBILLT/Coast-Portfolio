import React, { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'

import { Row, Col, Container } from 'react-bootstrap'
import { UserNavBar } from '../components/UserNavBar'
import EditPassword from '../components/EditPassword'
import EditAddress from '../components/EditAddress'
import ProtectedRoute from '../components/ProtectedRoute'



const ProfileInfoScreen = () => {

    const user = useContext(UserContext)

    return (
        <Container className="my-5 pb-5">
            <UserNavBar />
            <Row className="mt-5">
                <Col lg={6} className="px-5">
                    <h3>Name</h3>
                    <p className="mt-3 mb-5">{user.firstName} {user.lastName}</p>
                    <h3>Email</h3>
                    <p className="mt-3 mb-5">{user.email}</p>

                    <h3>Password</h3>
                    <EditPassword />
                </Col>

                <Col lg={6} className="px-5">
                    <h3>Address</h3>
                    <EditAddress />
                </Col>
            </Row>
        </Container>
    )
}

export default ProfileInfoScreen

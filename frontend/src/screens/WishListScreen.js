import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { UserNavBar } from '../components/UserNavBar'
import WishListCard from '../components/WishListCard'

export const WishListScreen = () => {

    const { userInfo } = useSelector(state => state.userLogin)


    return (
        <Container className="my-5 py-3">
            <UserNavBar></UserNavBar>
            <h2 className="mb-4">Wish List</h2>
            <Row>
                {userInfo && userInfo.wishList
                    ? userInfo.wishList.map(item => (
                        <Col xs={12} lg={4}  >
                            <WishListCard pID={item} />
                        </Col>
                        // <p>{item}</p>
                    ))
                    : <p>No Items in WishList </p>
                }
            </Row>
        </Container>
    )
}
export default WishListScreen

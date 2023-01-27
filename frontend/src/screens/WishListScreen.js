import React, { useContext } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { UserNavBar } from '../components/UserNavBar'
import WishListCard from '../components/WishListCard'
import { UserContext } from '../contexts/UserContext'

export const WishListScreen = () => {

    // const { userInfo } = useSelector(state => state.userLogin)

    const user = useContext(UserContext)

    return (
        <Container className="my-5 py-3">
            <UserNavBar></UserNavBar>
            <h2 className="mb-4">Wish List</h2>
            <Row>
                {user && user.wishList
                    ? user.wishList.map(item => (
                        <Col xs={12} lg={4} key={item} >
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

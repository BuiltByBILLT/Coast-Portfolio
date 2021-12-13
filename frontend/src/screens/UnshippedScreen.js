import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Table, Button, Row, Col, Container, Form, InputGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'


const OrderListScreen = ({ history, match }) => {

    // const [number, setNumber] = useState(0)

    // const dispatch = useDispatch()

    // const orderList = useSelector(state => state.orderList)
    // const { loading, error, orders } = orderList

    const { userInfo } = useSelector(state => state.userLogin)

    const user = useContext(UserContext)


    useEffect(() => {
        // if (userInfo && userInfo.isStaff) {
        remove()
        refetch()
        // } else {
        //     history.push('/login')
        // }

    }, [history, userInfo])

    const { isLoading, isError, data, error, refetch, remove } = useQuery('unshipped', () =>
        axios.get(`/api/orders/unshipped`)
    )


    return (
        <Container className="my-5 ">
            <h4 className="mb-5">Unshipped Orders</h4>
            {isLoading ? <Loader /> : isError ? <Message variant='danger'>{error}</Message>
                : (<>
                    {/* <p>{JSON.stringify(orders)}</p> */}
                    {
                        data && data.data.map(order => (
                            <>
                                <h5><Link to={`/order/${order.id}`}>{order.id}:</Link></h5>
                                {order.lineItems &&
                                    order.lineItems.map(line => (
                                        <>{line.name != "Website Shipping" && <p>( {line.qty} ) {line.name}</p>}</>
                                    ))
                                }

                            </>
                        ))
                    }

                </>)}
        </Container>
    )
}

export default OrderListScreen

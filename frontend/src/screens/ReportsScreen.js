import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Container, Form, InputGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { getAverage, getLowInv } from '../actions/reportActions'

const ReportScreen = ({ history, match }) => {
    const pageNumber = match.params.pageNumber || 1

    const now = new Date(Date.now())
    const nowPlusDay = new Date(Date.now() + 86400000)
    const today = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} `
    const tomrrow = `${nowPlusDay.getFullYear()}/${nowPlusDay.getMonth() + 1}/${nowPlusDay.getDate()} `
    // alert(today)
    const [start, setStart] = useState(today)
    const [end, setEnd] = useState(tomrrow)
    const [startType, setStartType] = useState("text")
    const [endType, setEndType] = useState("text")

    const { loading, error, dataLowInv } = useSelector(state => state.reportLowInv)
    const { userInfo } = useSelector(state => state.userLogin)
    const { loading: loadingAverage, error: errorAverage, dataAverage } = useSelector(state => state.reportAverage)

    const dispatch = useDispatch()
    useEffect(() => {
        if (userInfo && userInfo.isStaff) {
            dispatch(getLowInv())
        } else {
            history.push('/login')
        }
    }, [])


    useEffect(() => {
        if (userInfo && userInfo.isStaff) {
            var startUNIX = (new Date(start)).getTime()
            var endUNIX = (new Date(end)).getTime()
            dispatch(getAverage(startUNIX, endUNIX))
        } else {
            history.push('/login')
        }
    }, [start, end])

    return (
        <Container className="my-5 py-5">
            <Row className='pt-5 pb-4'>
                <h2 className="mx-auto">Average Orders Report</h2>
            </Row>
            {loadingAverage ? <Loader />
                : error ? <Message variant='danger'>{errorAverage}</Message>
                    : dataAverage && (<>
                        <Row className="my-5">
                            <Col xs="auto" className="my-auto">
                                <h4>Number of Orders:</h4>
                                {/* <p>{(start)}</p> */}
                            </Col>
                            <Col className="text-center">
                                <h2>{dataAverage.totalOrders}</h2>
                            </Col>
                            <Col xs="auto" className="my-auto">
                                <h4>Average Order Value: </h4>
                                {/* <p>{(end)}</p> */}
                            </Col>
                            <Col className="text-center">
                                <h2>{dataAverage.totalTotals}</h2>
                            </Col>
                        </Row>

                        <Form>
                            <Row className="mb-5 pb-5" >
                                <Col xs={{ span: 3, offset: 3 }}>
                                    <Form.Control
                                        type={startType}
                                        value={startType === "text" ? "Start Date" : start}
                                        onBlur={() => setStartType("text")}
                                        onFocus={() => setStartType("date")}
                                        onChange={(e) => setStart(e.target.value)}
                                    >
                                    </Form.Control>
                                </Col>
                                <Col xs={{ span: 3 }}>
                                    <Form.Control
                                        type={endType}
                                        value={endType === "text" ? "End Date" : end}
                                        onBlur={() => setEndType("text")}
                                        onFocus={() => setEndType("date")}
                                        onChange={(e) => setEnd(e.target.value)}
                                    >
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form>
                    </>)}


            <Row className='pt-5 pb-4'>
                <h2 className="mx-auto">Low Inventory Report</h2>
            </Row>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                : dataLowInv && (<>
                    <Table striped bordered hover responsive className='table-sm mt-3'>
                        <thead>
                            <tr>
                                <th>{"NAME "}
                                </th>
                                <th>{"MODIFIED "}
                                </th>
                                <th>{"PRICE "}
                                </th>
                                <th>{"STOCK "}
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataLowInv.map(product => (
                                <tr key={product.cloverID}>
                                    <td>{product.pName}</td>
                                    <td>{product.updatedAt.slice(0, 10)}</td>
                                    <td>{Number(product.pPrice / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                                    <td>{product.pInStock}</td>
                                    <td className="text-center">
                                        <LinkContainer to={`/product/${product.cloverID}`}>
                                            <Button variant='dark' className='btn-sm'>
                                                <i className="fas fa-link"></i>
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {/* <Paginate pages={pages} page={page} isAdmin={true} /> */}
                </>
                )}
        </Container>
    )
}

export default ReportScreen

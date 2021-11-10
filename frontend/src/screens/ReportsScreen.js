import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Container, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
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


    // useEffect(() => {
    //     if (userInfo && userInfo.isStaff) {
    //     var startUNIX = (new Date(start)).getTime()
    //     var endUNIX = (new Date(end)).getTime()
    //     dispatch(getAverage(startUNIX, endUNIX))
    // } else {
    //     history.push('/login')
    // }

    const sumbitHandler = (e) => {
        e.preventDefault()
        var startUNIX = (new Date(start)).getTime()
        var endUNIX = (new Date(end)).getTime()
        alert(`Start: ${start}\nEnd: ${end}\nStart: ${startUNIX}\nEnd: ${endUNIX}`)
        dispatch(getAverage(startUNIX, endUNIX))
    }
    return (
        <Container className="my-5">
            <Row className='pb-4'>
                <h2 className="mx-auto">Reports</h2>
            </Row>
            <Form>
                <Form.Row className="mb-5 justify-content-center" >
                    <Col xs={{ span: 3 }}>
                        <Form.Control
                            type={startType}
                            // value={startType === "text" ? "Start Date" : start}
                            value={start}
                            // onBlur={() => setStartType("text")}
                            // onFocus={() => setStartType("date")}
                            onChange={(e) => setStart(e.target.value)}
                        >
                        </Form.Control>
                    </Col>

                    <Col xs={{ span: 3 }}>
                        <Form.Control
                            type={endType}
                            // value={endType === "text" ? "End Date" : end}
                            value={end}
                            // onBlur={() => setEndType("text")}
                            // onFocus={() => setEndType("date")}
                            onChange={(e) => setEnd(e.target.value)}
                        >
                        </Form.Control>
                    </Col>
                    <Col xs={{ span: 3 }} >
                        <Button block style={{ paddingBottom: "8px" }}
                            onClick={sumbitHandler} >
                            Go
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
            {/* {loadingAverage ? <Loader />
                : error ? <Message variant='danger'>{errorAverage}</Message>
                    : dataAverage && (<> */}
            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h4>Number of Orders:</h4>
                    {/* <p>{(start)}</p> */}
                </Col>
                <Col xs="auto" className="text-center">
                    <h2>{0}</h2>
                </Col>
            </Row>
            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h4>Average Order Value:</h4>
                    {/* <p>{(start)}</p> */}
                </Col>
                <Col xs="auto" className="text-center">
                    <h2>{0}</h2>
                </Col>
            </Row>
            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h4>Best Selling Products (By Price):</h4>
                    {/* <p>{(start)}</p> */}
                </Col>
                <Col xs="auto" className="text-center">
                    <h2>{""}</h2>
                </Col>
            </Row>
            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h4>Best Selling Products (By Qty):</h4>
                    {/* <p>{(start)}</p> */}
                </Col>
                <Col xs="auto" className="text-center">
                    <h2>{""}</h2>
                </Col>
            </Row>
            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h4>Best Selling Category (By Price):</h4>
                    {/* <p>{(start)}</p> */}
                </Col>
                <Col xs="auto" className="text-center">
                    <h2>{""}</h2>
                </Col>
            </Row>
            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h4>Best Selling Category (By Qty):</h4>
                    {/* <p>{(start)}</p> */}
                </Col>
                <Col xs="auto" className="text-center">
                    <h2>{""}</h2>
                </Col>
            </Row>
            {/* </>)
            } */}

            <Form>
                <Form.Row className="mb-5 justify-content-center" >
                    <Col xs={{ span: 3 }} className="my-auto">
                        <h4 >Day over Day</h4>
                    </Col>

                    <Col xs={{ span: 3 }}>
                        <Form.Control
                            type={endType}
                            // value={endType === "text" ? "End Date" : end}
                            value={end}
                            // onBlur={() => setEndType("text")}
                            // onFocus={() => setEndType("date")}
                            onChange={(e) => setEnd(e.target.value)}
                        >
                        </Form.Control>
                    </Col>
                    <Col xs={{ span: 3 }} >
                        <Button block style={{ paddingBottom: "8px" }}
                            onClick={sumbitHandler} >
                            Go
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h4>Total Sales on (2021/11/1):</h4>
                    {/* <p>{(start)}</p> */}
                </Col>
                <Col xs="auto" className="text-center">
                    <h2>{0}</h2>
                </Col>
                <Col xs="auto" className="my-auto">
                    <h4>Total Sales on (2021/10/31):</h4>
                    {/* <p>{(start)}</p> */}
                </Col>
                <Col xs="auto" className="text-center">
                    <h2>{0}</h2>
                </Col>
            </Row>

            <Form>
                <Form.Row className="mb-5 justify-content-center" >
                    <Col xs={{ span: 3 }} className="my-auto">
                        <h4 >Month over Month</h4>
                    </Col>

                    <Col xs={{ span: 3 }}>
                        <Form.Control
                            type={endType}
                            // value={endType === "text" ? "End Date" : end}
                            value={end}
                            // onBlur={() => setEndType("text")}
                            // onFocus={() => setEndType("date")}
                            onChange={(e) => setEnd(e.target.value)}
                        >
                        </Form.Control>
                    </Col>
                    <Col xs={{ span: 3 }} >
                        <Button block style={{ paddingBottom: "8px" }}
                            onClick={sumbitHandler} >
                            Go
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h4>Total Sales in (November):</h4>
                    {/* <p>{(start)}</p> */}
                </Col>
                <Col xs="auto" className="text-center">
                    <h2>{0}</h2>
                </Col>
                <Col xs="auto" className="my-auto">
                    <h4>Total Sales in (October):</h4>
                    {/* <p>{(start)}</p> */}
                </Col>
                <Col xs="auto" className="text-center">
                    <h2>{0}</h2>
                </Col>
            </Row>

            <Form>
                <Form.Row className="mb-5 justify-content-center" >
                    <Col xs={{ span: 3 }} className="my-auto">
                        <h4 >Year over Year</h4>
                    </Col>

                    <Col xs={{ span: 3 }}>
                        <Form.Control
                            type={endType}
                            // value={endType === "text" ? "End Date" : end}
                            value={end}
                            // onBlur={() => setEndType("text")}
                            // onFocus={() => setEndType("date")}
                            onChange={(e) => setEnd(e.target.value)}
                        >
                        </Form.Control>
                    </Col>
                    <Col xs={{ span: 3 }} >
                        <Button block style={{ paddingBottom: "8px" }}
                            onClick={sumbitHandler} >
                            Go
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h4>Total Sales on (2021)</h4>
                    {/* <p>{(start)}</p> */}
                </Col>
                <Col xs="auto" className="text-center">
                    <h2>{0}</h2>
                </Col>
                <Col xs="auto" className="my-auto">
                    <h4>Total Sales on (2020):</h4>
                    {/* <p>{(start)}</p> */}
                </Col>
                <Col xs="auto" className="text-center">
                    <h2>{0}</h2>
                </Col>
            </Row>



            <Row className='pt-5 pb-4'>
                <h2 className="mx-auto">Low Inventory Report</h2>
            </Row>
            {
                loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
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
                    )
            }
        </Container >
    )
}

export default ReportScreen

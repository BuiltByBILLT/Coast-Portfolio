import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useMutation } from 'react-query'
import { toUSD } from '../common'
import { UserContext } from '../contexts/UserContext'
import Message from './Message'

const ReportCustomRange = () => {

    const offset = new Date().getTimezoneOffset() * 60000

    const user = useContext(UserContext)
    const [startString, setStartString] = useState("")
    const [endString, setEndString] = useState("")
    const [start, setStart] = useState("")
    const [end, setEnd] = useState("")
    const [error, setError] = useState("")
    const [report, setReport] = useState({ topQty: [], topPrice: [], topCatQty: [], topCatPrice: [], totalOrders: "", averageValue: 0 })

    useEffect(() => {
        console.log("start", startString)
        setStart(Date.parse(startString) + offset)
        console.log("start", start)
    }, [startString])
    useEffect(() => {
        console.log("end", endString)
        setEnd(Date.parse(endString) + 86400000 + offset)
        console.log("end", end)
    }, [endString])

    // Mutation: Update Brand 
    const { mutate, isLoading, reset } = useMutation(data => {
        console.log(data)
        return axios.post(`/api/reports/custom`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            const raw = data.data
            setReport({ ...raw })
            setError("")
            reset()
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Handlers
    const sumbitHandler = (e) => {
        e.preventDefault()
        mutate({ start, end })
    }


    return (
        <div>
            <Form>
                <Form.Row className="mb-5 justify-content-center" >
                    <Col xs={{ span: 3 }} className="text-center">
                        <Form.Control
                            type={"date"}
                            value={startString}
                            onChange={(e) => setStartString(e.target.value)}
                        >
                        </Form.Control>
                        Start: (00:01 AM)
                    </Col>

                    <Col xs={{ span: 3 }} className="text-center">
                        <Form.Control
                            type={"date"}
                            value={endString}
                            onChange={(e) => setEndString(e.target.value)}
                        >
                        </Form.Control>
                        End: (11:59 PM)
                    </Col>
                    <Col xs={{ span: 3 }} >
                        <Button block style={{ paddingBottom: "8px" }}
                            disabled={!startString || !endString || isLoading}
                            onClick={sumbitHandler} >
                            {isLoading ? "Loading" : "Go"}
                        </Button>
                    </Col>
                </Form.Row>
            </Form>

            {error && <Message variant="danger">{error}</Message>}
            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h5>Number of Orders:</h5>
                </Col>
                <Col xs="auto" className="text-center">
                    <h3>{report.totalOrders}</h3>
                </Col>
            </Row>

            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h5>Average Order Value:</h5>
                </Col>
                <Col xs="auto" className="text-center">
                    <h3>{toUSD(report.averageValue)}</h3>
                </Col>
            </Row>

            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h5>Best Selling Products (By Price):</h5>
                </Col>
                <Col xs="auto" className="text-right">
                    {report.topPrice.map(el => (
                        <h5>{`${el[0]}:`}</h5>
                    ))}
                </Col>
                <Col xs="auto" className="text-left">
                    {report.topPrice.map(el => (
                        <h5>{toUSD(el[1])}</h5>
                    ))}
                </Col>
            </Row>

            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h5>Best Selling Products (By Qty):</h5>
                </Col>
                <Col xs="auto" className="text-right">
                    {report.topQty.map(el => (
                        <h5>{`${el[0]}:`}</h5>
                    ))}
                </Col>
                <Col xs="auto" className="text-left">
                    {report.topQty.map(el => (
                        <h5>{el[1]}</h5>
                    ))}
                </Col>
            </Row>

            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h5>Best Selling Categories (By Price):</h5>
                </Col>
                <Col xs="auto" className="text-right">
                    {report.topCatPrice.map(el => (
                        <h5>{el[0]}</h5>
                    ))}
                </Col>
                <Col xs="auto" className="text-left">
                    {report.topCatPrice.map(el => (
                        <h5>{toUSD(el[1])}</h5>
                    ))}
                </Col>
            </Row>

            <Row className="my-5 justify-content-center">
                <Col xs="auto" className="my-auto">
                    <h5>Best Selling Categories (By Qty):</h5>
                </Col>
                <Col xs="auto" className="text-right">
                    {report.topCatQty.map(el => (
                        <h5>{`${el[0]}:`}</h5>
                    ))}
                </Col>
                <Col xs="auto" className="text-left">
                    {report.topCatQty.map(el => (
                        <h5>{el[1]}</h5>
                    ))}
                </Col>
            </Row>

        </div>
    )
}

export default ReportCustomRange

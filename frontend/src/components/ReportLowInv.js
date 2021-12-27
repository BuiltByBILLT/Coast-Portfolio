import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Button, Col, Form, Table } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { LinkContainer } from 'react-router-bootstrap'
import { UserContext } from '../contexts/UserContext'
import Message from './Message'

const ReportLowInv = () => {

    const user = useContext(UserContext)
    const [error, setError] = useState("")

    const { isFetching, data, refetch } = useQuery('lowInvReport', () => {
        return axios.get(`/api/reports/low`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        enabled: false,
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })
    const dataLowInv = data && data.data


    // Handlers
    const sumbitHandler = (e) => {
        e.preventDefault()
        refetch()
    }

    return (
        <div>
            <Form>
                <Form.Row className="mb-5 justify-content-center" >
                    <Col xs={{ span: 3 }} className="text-left my-auto">
                        <h4>Low Inventory:</h4>
                    </Col>
                    <Col xs={{ span: 3 }} className="text-center my-auto">
                        <h4>(Under 5)</h4>
                    </Col>

                    <Col xs={{ span: 3 }} >
                        <Button block style={{ paddingBottom: "8px" }}
                            disabled={isFetching}
                            onClick={sumbitHandler} >
                            {isFetching ? "Loading" : "Go"}
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
            {error && <Message variant='danger'>{error}</Message>}
            {dataLowInv && (<Table striped bordered hover responsive className='table-sm mt-3'>
                <thead>
                    <tr>
                        <th>{"NAME "} </th>
                        <th>{"STOCK "}</th>
                    </tr>
                </thead>
                <tbody>
                    {dataLowInv.map(inv => (
                        <tr key={inv.cloverID}>
                            <LinkContainer to={`/admin/inventory/${inv.cloverID}/edit`}
                                style={{ cursor: "pointer" }}>
                                <td>{inv.cloverName}</td>
                            </LinkContainer>
                            <td>{inv.iStock}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            )}
        </div>
    )
}

export default ReportLowInv

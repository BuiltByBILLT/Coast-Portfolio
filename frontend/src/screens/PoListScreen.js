import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { toUSD } from '../common'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const PoListScreen = ({ history }) => {

    // States and Contexts
    const user = useContext(UserContext)
    const [search, setSearch] = useState("")
    const [filtered, setFiltered] = useState([])
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // List Query
    const { isLoading: qLoading, data, refetch } = useQuery("poListAdmin", () => {
        return axios.get(`/api/pos`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })
    const pos = data && data.data


    // Filter Effect
    useEffect(() => {
        if (pos && !search) setFiltered(pos)
        if (pos && search) {
            setFiltered(pos.filter(po =>
                po.merchantName.toLowerCase().includes(search.toLowerCase()) || po._id.toLowerCase().includes(search.toLowerCase())
            ))
        }
    }, [pos, search])

    // Handlers
    const createHandler = () => {
        history.push('/admin/ponew')
    }

    return (
        <Container className="my-5 pt-3 pb-5">
            <Row className='align-items-center'>
                <Col className="my-auto">
                    <h2 className="my-0">Purchase Orders</h2>
                </Col>
                <Col className="my-auto">
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <InputGroup>
                            <Form.Control placeholder="Search by ID or Merchant" aria-label="Search by ID or Merchant"
                                style={{ height: "50px" }}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <InputGroup.Append>
                                <Button variant="primary">
                                    <i className="fas fa-search"></i>
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </Col>
                <Col className="text-right" xs="auto">
                    <Button variant="danger" className='my-3' onClick={createHandler}>
                        <i className='fas fa-plus'></i> New PO
                    </Button>
                </Col>
            </Row>
            {error && <Message variant="danger">{error}</Message>}
            {success && <Message variant="success">{success}</Message>}
            {qLoading ? <Loader /> : (
                <Table striped bordered hover responsive className='table-sm mt-3 mb-0'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>MERCHANT</th>
                            <th>LINE ITEMS</th>
                            <th>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pos && filtered.map(po => (
                            <tr key={po._id}>
                                <td>{po._id}</td>
                                <td>{po.createdAt.slice(0, 10)}</td>
                                <td>{po.merchantName}</td>
                                <td>{po.lineItems.length}</td>
                                <td>{po.status}</td>
                                <td className="p-0 align-middle text-center">
                                    <LinkContainer to={`/admin/po/${po._id}/edit`} className="my-auto">
                                        <Button variant='dark' className='btn-sm'>
                                            {po.status == "ORDERED"
                                                ? <i className='fas fa-edit'></i>
                                                : <i className='fas fa-eye'></i>
                                            }
                                        </Button>
                                    </LinkContainer>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    )
}

export default PoListScreen

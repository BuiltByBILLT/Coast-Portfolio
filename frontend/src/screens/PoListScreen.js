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
    const { isLoading: qLoading, data, refetch } = useQuery("discountListAdmin", () => {
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

    // Delete Mutation
    const { mutate, isLoading: mLoading, reset } = useMutation(discountCode => {
        return axios.delete(`/api/pos/edit/${discountCode}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess(`Deleted PO ${data.data.discountCode} Successfully`)
            setError("")
            reset()
            refetch()
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Filter Effect
    useEffect(() => {
        if (pos && !search) setFiltered(pos)
        if (pos && search)
            setFiltered(pos.filter(cat =>
                cat.discountCode.toLowerCase().includes(search.toLowerCase()) || cat.discountDescription.toLowerCase().includes(search.toLowerCase())
            ))
    }, [pos, search])

    // Handlers
    const createHandler = () => {
        history.push('/admin/discountnew')
    }
    const deleteHandler = (discountCode) => {
        if (window.confirm(`Delete PO: ${discountCode} \nAre you sure?`)) mutate(discountCode)
    }


    return (
        <Container className="my-5 pt-3 pb-5">
            <Row className='align-items-center'>
                <Col className="my-auto">
                    <h2 className="my-0">POs</h2>
                </Col>
                <Col className="my-auto">
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <InputGroup>
                            <Form.Control placeholder="Search by Code or Description" aria-label="Search by Name or ID"
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
            {qLoading || mLoading ? <Loader /> : (
                <Table striped bordered hover responsive className='table-sm mt-3 mb-0'>
                    <thead>
                        <tr>
                            <th>CODE</th>
                            <th>DESCRIPTION</th>
                            <th>TYPE</th>
                            <th>AMOUNT</th>
                            <th>LIVE</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pos && filtered.map(discount => (
                            <tr key={discount.discountCode}>
                                <td>{discount.discountCode}</td>
                                <td>{discount.discountDescription}</td>
                                <td>{discount.discountType}</td>
                                <td>{discount.discountType === "FLAT"
                                    ? toUSD(discount.discountAmount)
                                    : discount.discountAmount + "%"}</td>
                                <td>
                                    {discount.discountLive
                                        ? <i className='fas fa-check text-success'></i>
                                        : <i className='fas fa-times text-danger'></i>
                                    }
                                </td>
                                <td className="p-0 align-middle text-center">
                                    <LinkContainer to={`/admin/discount/${discount.discountCode}/edit`} className="my-auto">
                                        <Button variant='dark' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm ml-2'
                                        onClick={() => deleteHandler(discount.discountCode)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
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

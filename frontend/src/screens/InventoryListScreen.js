import React, { useContext, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Container, Form, InputGroup } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { useMutation, useQuery } from 'react-query'
import axios from 'axios'

const InventoryListScreen = ({ history }) => {

    // States and Contexts
    const user = useContext(UserContext)
    const [search, setSearch] = useState("")
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // List Query
    const { isLoading: qLoading, data, refetch } = useQuery(`inventoryListAdmin`, () => {
        return axios.get(`/api/inventory?keyword=${search}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })
    const inventory = data && data.data && data.data.inventory
    const page = data && data.data && data.data.page
    const pages = data && data.data && data.data.pages

    // Delete Mutation
    const { mutate, isLoading: mLoading, reset } = useMutation(cloverID => {
        return axios.delete(`/api/inventory/edit/${cloverID}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess(`Deleted Inventory ${data.data.cloverID} Successfully`)
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

    // Handlers
    const searchHandler = (e) => {
        e.preventDefault()
        refetch()
    }
    const createHandler = () => {
        history.push('/admin/inventorynew')
    }
    const deleteHandler = (cloverID) => {
        if (window.confirm(`Delete inventory: ${cloverID} \nAre you sure?`)) mutate(cloverID)
    }

    return (
        <Container className="my-5 py-3">
            <Row className='align-items-center'>
                <Col className="my-auto">
                    <h2 className="my-0">Inventory</h2>
                </Col>
                <Col className="my-auto">
                    <Form onSubmit={searchHandler}>
                        <InputGroup>
                            <Form.Control placeholder="Search by Name or ID" aria-label="Search by Name or ID"
                                style={{ height: "50px" }}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <InputGroup.Append>
                                <Button variant="primary" onClick={searchHandler}>
                                    <i className="fas fa-search"></i>
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </Col>
                <Col className="text-right" xs="auto">
                    <Button variant="danger" className='my-3' onClick={createHandler}>
                        <i className='fas fa-plus'></i> Inventory
                    </Button>
                </Col>
            </Row>

            {error && <Message variant="danger">{error}</Message>}
            {success && <Message variant="success">{success}</Message>}
            {qLoading || mLoading ? <Loader /> : (
                <Table striped bordered hover responsive className='table-sm mt-3'>
                    <thead>
                        <tr>

                            <th>MODIFIED</th>
                            <th>CLOVER ID</th>
                            <th>PARENT</th>
                            <th>CLOVER NAME</th>
                            <th>PRICE</th>
                            <th>STOCK</th>
                            <th>SELL </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory && inventory.map(inventory => (
                            <tr key={inventory.cloverID}>
                                <td style={{ minWidth: "110px" }}>{inventory.updatedAt.slice(0, 10)}</td>
                                <td style={{ minWidth: "110px" }}>{inventory.cloverID}</td>
                                <td>{inventory.iParent}</td>
                                <td>{inventory.cloverName}</td>
                                <td>{Number(inventory.iPrice / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
                                }</td>
                                <td>{inventory.iStock}</td>
                                <td>
                                    {inventory.iSell
                                        ? <i className='fas fa-check text-success'></i>
                                        : <i className='fas fa-times text-danger'></i>
                                    }
                                </td>
                                <td className="text-center px-1" style={{ minWidth: "110px" }}>
                                    <LinkContainer to={`/admin/inventory/${inventory.cloverID}/edit`}>
                                        <Button variant='dark' className='btn-sm mr-2'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm'
                                        onClick={() => deleteHandler(inventory.cloverID, inventory.pName)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <div className="d-flex justify-content-center">
                <Paginate pages={pages} page={page} />
            </div>
        </Container>
    )
}

export default InventoryListScreen

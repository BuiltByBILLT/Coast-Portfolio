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

const ProductListScreen = ({ history }) => {

    // States and Contexts
    const user = useContext(UserContext)
    const [search, setSearch] = useState("")
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // List Query
    const { isLoading: qLoading, data, refetch } = useQuery(`productListAdmin`, () => {
        return axios.get(`/api/products?keyword=${search}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })
    const products = data && data.data && data.data.products
    const page = data && data.data && data.data.page
    const pages = data && data.data && data.data.pages

    // Delete Mutation
    const { mutate, isLoading: mLoading, reset } = useMutation(pID => {
        return axios.delete(`/api/products/edit/${encodeURIComponent(pID)}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess(`Deleted Product ${data.data.pID} Successfully`)
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
        history.push('/admin/productnew')
    }
    const deleteHandler = (pID) => {
        if (window.confirm(`Delete product: ${pID} \nAre you sure?`)) mutate(pID)
    }

    return (
        <Container className="my-5 py-3">
            <Row className='align-items-center'>
                <Col className="my-auto">
                    <h2 className="my-0">Product Pages</h2>
                </Col>
                <Col className="my-auto">
                    <Form onSubmit={searchHandler}>
                        <InputGroup>
                            <Form.Control placeholder="Search by Name or SKU" aria-label="Search by Name or SKU"
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
                        <i className='fas fa-plus'></i> New Page
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
                            <th>SKU</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>DISPLAY</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.map(product => (
                            <tr key={product.pID}>
                                <td>{product.updatedAt.slice(0, 10)}</td>
                                <td>{product.pID}</td>
                                <td>{product.pDisplay
                                    ? <Link to={`/product/${encodeURIComponent(product.pID)}`}>{product.pName}</Link>
                                    : product.pName
                                }</td>
                                <td>{product.pPrice
                                    ? Number(product.pPrice / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
                                    : "Options"
                                }</td>
                                <td >
                                    {product.pDisplay
                                        ? <i className='fas fa-check text-success'></i>
                                        : <i className='fas fa-times text-danger'></i>
                                    }
                                </td>
                                <td className="text-center px-1">
                                    <LinkContainer to={`/admin/product/${encodeURIComponent(product.pID)}/edit`}>
                                        <Button variant='dark' className='btn-sm mr-2'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm'
                                        onClick={() => deleteHandler(product.pID)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <div className="d-flex justify-content-center">
                <Paginate pages={pages} page={page} grey={true} />
            </div>
            <p className="text-muted text-center">Use Search for more results</p>

        </Container>
    )
}

export default ProductListScreen

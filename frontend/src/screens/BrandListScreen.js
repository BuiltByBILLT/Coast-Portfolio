import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const BrandListScreen = ({ history }) => {

    // States and Contexts
    const user = useContext(UserContext)
    const [search, setSearch] = useState("")
    const [filtered, setFiltered] = useState([])
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // List Query
    const { isLoading: qLoading, data, refetch } = useQuery("brandList", () => {
        return axios.get(`/api/brands`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })
    const brands = data && data.data

    // Delete Mutation
    const { mutate, isLoading: mLoading, reset } = useMutation(brandID => {
        return axios.delete(`/api/brands/edit/${brandID}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess(`Deleted Brand ${data.data.brandID} Successfully`)
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
        if (brands && !search) setFiltered(brands)
        if (brands && search)
            setFiltered(brands.filter(cat =>
                cat.brandName.toLowerCase().includes(search.toLowerCase()) || cat.brandID.toString().includes(search)
            ))
    }, [brands, search])

    // Handlers
    const createHandler = () => {
        history.push('/admin/brandnew')
    }
    const deleteHandler = (brandID) => {
        if (window.confirm(`Delete Brand: ${brandID} \nAre you sure?`)) mutate(brandID)
    }


    return (
        <Container className="my-5 py-3">
            <Row className='align-items-center'>
                <Col className="my-auto">
                    <h2 className="my-0">Brands</h2>
                </Col>
                <Col className="my-auto">
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <InputGroup>
                            <Form.Control placeholder="Search by Name or ID" aria-label="Search by Name or ID"
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
                        <i className='fas fa-plus'></i> New Brand
                    </Button>
                </Col>
            </Row>
            {error && <Message variant="danger">{error}</Message>}
            {success && <Message variant="success">{success}</Message>}
            {qLoading || mLoading ? <Loader /> : (
                <Table striped bordered hover responsive className='table-sm mt-3 mb-0'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands && filtered.map(brand => (
                            <tr key={brand.brandID}>
                                <td>{brand.brandID}</td>
                                <td><Link to={`/search/ALL/page/1/brands/${brand.brandID}`}>{brand.brandName}</Link></td>
                                <td className="p-0 align-middle text-center">
                                    <LinkContainer to={`/admin/brand/${brand.brandID}/edit`} className="my-auto">
                                        <Button variant='dark' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm ml-2'
                                        onClick={() => deleteHandler(brand.brandID)}>
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

export default BrandListScreen

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const CategoryListScreen = ({ history }) => {

    // States and Contexts
    const user = useContext(UserContext)
    const [search, setSearch] = useState("")
    const [filtered, setFiltered] = useState([])
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // List Query
    const { isLoading: qLoading, data, refetch } = useQuery("categoryListAdmin", () => {
        return axios.get(`/api/categories`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })
    const categories = data && data.data

    // Delete Mutation
    const { mutate, isLoading: mLoading, reset } = useMutation(sectionID => {
        return axios.delete(`/api/categories/edit/${sectionID}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess(`Deleted Category ${data.data.sectionID} Successfully`)
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
        if (categories && !search) setFiltered(categories)
        if (categories && search)
            setFiltered(categories.filter(cat =>
                cat.sectionName.toLowerCase().includes(search.toLowerCase()) || cat.sectionID.toString().includes(search) || cat.topSection == search
            ))
    }, [categories, search])

    // Handlers
    const createHandler = () => {
        history.push('/admin/categorynew')
    }
    const deleteHandler = (sectionID) => {
        if (window.confirm(`Delete Category: ${sectionID} \nAre you sure?`)) mutate(sectionID)
    }


    return (
        <Container className="my-5 py-3">
            <Row className='align-items-center'>
                <Col className="my-auto">
                    <h2 className="my-0">Categories</h2>
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
                        <i className='fas fa-plus'></i> New Category
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
                            <th>PARENT ID</th>
                            <th>NAME</th>
                            <th>DISPLAY</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories && filtered.map(category => (
                            <tr key={category.sectionID}>
                                <td>{category.sectionID}</td>
                                <td>{category.topSection}</td>
                                <td><Link to={`/category/${category.sectionID}`}>{category.sectionName}</Link></td>
                                <td>
                                    {!category.sectionDisabled
                                        ? <i className='fas fa-check text-success'></i>
                                        : <i className='fas fa-times text-danger'></i>
                                    }
                                </td>
                                <td className="p-0 align-middle text-center">
                                    <LinkContainer to={`/admin/category/${category.sectionID}/edit`} className="my-auto">
                                        <Button variant='dark' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm ml-2'
                                        onClick={() => deleteHandler(category.sectionID)}>
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

export default CategoryListScreen

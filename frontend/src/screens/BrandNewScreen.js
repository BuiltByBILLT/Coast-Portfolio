import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const BrandNewScreen = ({ history }) => {

    // States and Contexts
    const user = useContext(UserContext)

    const [brandID, setBrandID] = useState("")
    const [brandName, setBrandName] = useState("")

    const [available, setAvailable] = useState(true)
    const [edit, setEdit] = useState(true)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // Query: All Categories  
    const { isLoading: queryLoading, data: queryData } = useQuery("brandListAdmin", () => {
        return axios.get(`/api/brands`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Mutation: New Brand
    const { mutate, isLoading: mutationLoading, reset } = useMutation(data => {
        return axios.post(`/api/brands/edit/${brandID}`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess("Brand Creation Success!")
            setError("")
            setEdit(false)
            reset()
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Effect: Check if Brand ID is already Taken
    useEffect(() => {
        if (queryData && queryData.data) {
            const match = queryData.data.filter(brand => brand.brandID == brandID)
            if (match.length) setAvailable(false)
            else setAvailable(true)
        }
        if (brandID == "") setAvailable(true)
    }, [brandID, queryData])

    // Handlers
    const saveHandler = (e) => {
        e.preventDefault()
        mutate({ brandName, brandID })
    }
    const cancelHandler = (e) => {
        e.preventDefault()
        history.push('/admin/brandlist')
    }

    return (
        <Container className="my-5 pb-5">
            <Row>
                <Col xs={8}>
                    <Row>
                        <Col>
                            <Link to="/admin/brandlist">{"<-- Brand List"}</Link>
                        </Col>
                    </Row>
                    <h2 className="mt-3">New Brand</h2>
                    {queryLoading ? <Loader />
                        : mutationLoading ? <Loader /> : (
                            <Form className="my-5" onSubmit={saveHandler}>
                                {error && <Message variant="danger">{error}</Message>}
                                {success && <Message variant="success">{success}</Message>}
                                <Form.Group controlId='SectionID'>
                                    <Form.Label>Brand ID</Form.Label>
                                    <Form.Control type='number' placeholder='Brand ID' value={brandID} required disabled={!edit}
                                        isInvalid={!available}
                                        onChange={(e) => setBrandID(e.target.value)}>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {brandID} is already in use
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId='Name'>
                                    <Form.Label>Brand Name</Form.Label>
                                    <Form.Control type='text' placeholder='Brand Name' value={brandName} required disabled={!edit}
                                        onChange={(e) => setBrandName(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                {edit && (
                                    <>
                                        <Button variant='secondary' className="text-danger p-0" type="submit" disabled={!available}>
                                            Save
                                        </Button>
                                        <Button variant='secondary' className="p-0 ml-5" type="button"
                                            onClick={cancelHandler}>
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </Form>
                        )}
                </Col>
            </Row>
        </Container>
    )
}

export default BrandNewScreen

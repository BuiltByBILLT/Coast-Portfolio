import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const BrandEditScreen = ({ match }) => {

    // States and Contexts
    const ID = match.params.id
    const user = useContext(UserContext)

    const [brandID, setBrandID] = useState(ID)
    const [brandName, setBrandName] = useState("")

    const [edit, setEdit] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // Query: Get Details
    const { isLoading: queryLoading, refetch } = useQuery([`brandEdit`, ID], () => {
        return axios.get(`/api/brands/edit/${ID}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setBrandName(data.data.brandName)
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Mutation: Update Brand 
    const { mutate, isLoading: mutationLoading, reset } = useMutation(data => {
        return axios.put(`/api/brands/edit/${ID}`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess("Brand Update Success")
            setError("")
            setEdit(false)
            reset()
            refetch()
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Handlers
    const saveHandler = (e) => {
        e.preventDefault()
        mutate({ brandName, brandID })
    }
    const editHandler = (e) => {
        e.preventDefault()
        setEdit(true)
        setError("")
        setSuccess("")
    }
    const cancelHandler = () => {
        setEdit(false)
        refetch()
    }

    return (
        <Container className="my-5 pb-5">
            <Row>
                <Col xs={8}>
                    <Row>
                        <Col>
                            <Link to="/admin/brandlist">{"<-- Brand List"}</Link>
                        </Col>
                        <Col className="text-right">
                            <Link to={`/brand/${ID}`}>{"Go to Brand -->"}</Link>
                        </Col>
                    </Row>
                    <h2 className="mt-3">Edit Brand</h2>
                    {queryLoading ? <Loader />
                        : mutationLoading ? <Loader /> : (
                            <Form className="my-5" onSubmit={saveHandler}>
                                {error && <Message variant="danger">{error}</Message>}
                                {success && <Message variant="success">{success}</Message>}
                                <Form.Group controlId='SectionID'>
                                    <Form.Label>Brand ID</Form.Label>
                                    <Form.Control type='number' placeholder='Brand ID' value={brandID} required disabled={true}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Name'>
                                    <Form.Label>Brand Name</Form.Label>
                                    <Form.Control type='text' placeholder='Name' value={brandName} required disabled={!edit}
                                        onChange={(e) => setBrandName(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                {edit ? (
                                    <>
                                        <Button variant='secondary' className="text-danger p-0" type="submit">
                                            Save
                                        </Button>
                                        <Button variant='secondary' className="p-0 ml-5" type="button"
                                            onClick={cancelHandler}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant='secondary' className="text-danger p-0" type="button"
                                        onClick={editHandler}>
                                        Edit
                                    </Button>
                                )}
                            </Form>
                        )}
                </Col>
            </Row>
        </Container>
    )
}

export default BrandEditScreen

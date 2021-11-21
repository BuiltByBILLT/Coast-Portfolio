import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const ProductNewScreen = ({ history }) => {

    // States and Contexts
    const user = useContext(UserContext)

    const [pID, setPID] = useState("")
    const [pName, setPName] = useState("")
    const [pSection, setPSection] = useState("")
    const [pManufacturer, setPManufacturer] = useState("")
    const [pDescription, setPDescription] = useState("")
    const [hasOptions, setHasOptions] = useState(false)
    const [optionGroup, setOptionGroup] = useState("")
    const [pDisplay, setPDisplay] = useState(false)

    const [available, setAvailable] = useState(true)
    const [edit, setEdit] = useState(true)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // Query: All Categories  
    const { isLoading: queryLoading, data: queryData } = useQuery("productListAdmin", () => {
        return axios.get(`/api/products/PIDs`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Mutation: New Product
    const { mutate, isLoading: mutationLoading, reset } = useMutation(data => {
        return axios.post(`/api/products/edit/${pID}`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess("Product Creation Success!")
            setError("")
            setEdit(false)
            reset()
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Effect: Check if Product ID is already Taken
    useEffect(() => {
        if (queryData && queryData.data) {
            const match = queryData.data.filter(product => product.pID == pID)
            if (match.length) setAvailable(false)
            else setAvailable(true)
        }
        if (pID == "") setAvailable(true)
    }, [pID, queryData])


    // Handlers
    const saveHandler = (e) => {
        e.preventDefault()
        mutate({ pName, pID, pSection, pManufacturer, pDescription, pDisplay })
    }
    const cancelHandler = (e) => {
        e.preventDefault()
        history.push('/admin/productlist')
    }

    return (
        <Container className="my-5 pb-5">
            <Row>
                <Col xs={8}>
                    <Row>
                        <Col>
                            <Link to="/admin/productlist">{"<-- Product Page List"}</Link>
                        </Col>
                    </Row>
                    <h2 className="mt-3">New Product Page</h2>
                    {queryLoading ? <Loader />
                        : mutationLoading ? <Loader /> : (
                            <Form className="my-5" onSubmit={saveHandler}>
                                {error && <Message variant="danger">{error}</Message>}
                                {success && <Message variant="success">{success}</Message>}
                                <Form.Group controlId='Product ID'>
                                    <Form.Label>Product SKU</Form.Label>
                                    <Form.Control type='text' placeholder='Product SKU' value={pID} required disabled={!edit}
                                        isInvalid={!available}
                                        onChange={(e) => setPID(e.target.value)}>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {pID} is already in use
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId='Name'>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type='text' placeholder='Name' value={pName} required disabled={!edit}
                                        onChange={(e) => setPName(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Category'>
                                    <Form.Label>Category ID</Form.Label>
                                    <Form.Control type='number' placeholder='Category' value={pSection} required disabled={!edit}
                                        onChange={(e) => setPSection(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Manufacturer'>
                                    <Form.Label>Brand ID</Form.Label>
                                    <Form.Control type='number' placeholder='Manufacturer' value={pManufacturer} required disabled={!edit}
                                        onChange={(e) => setPManufacturer(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Description'>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as='textarea' placeholder='Description' value={pDescription} disabled={!edit}
                                        onChange={(e) => setPDescription(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Check type="checkbox" id="optionsCheck" className="mb-3" custom
                                    label="Has Options" disabled={!edit}
                                    checked={hasOptions}
                                    onChange={(e) => setHasOptions(e.target.checked)}>
                                </Form.Check>
                                {hasOptions && <Form.Group controlId='hasOptions'>
                                    <Form.Label>Option Group Text</Form.Label>
                                    <Form.Control type='text' placeholder='ex: Select Size' value={optionGroup} required disabled={!edit}
                                        onChange={(e) => setOptionGroup(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>}
                                <Form.Check type="checkbox" id="displayCheck" className="mb-3" custom
                                    label="Display Product" disabled={!edit}
                                    checked={pDisplay}
                                    onChange={(e) => setPDisplay(e.target.checked)}>
                                </Form.Check>
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

export default ProductNewScreen

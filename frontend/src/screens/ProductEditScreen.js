import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import ImageEditer from '../components/ImageEditer'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const ProductEditScreen = ({ match }) => {

    // States and Contexts
    const ID = match.params.id
    const user = useContext(UserContext)

    const [pID, setPID] = useState("")
    const [pName, setPName] = useState("")
    const [pSection, setPSection] = useState("")
    const [pManufacturer, setPManufacturer] = useState("")
    const [pDescription, setPDescription] = useState("")
    const [hasOptions, setHasOptions] = useState(false)
    const [optionGroup, setOptionGroup] = useState("")
    const [pDisplay, setPDisplay] = useState(false)

    const [images, setImages] = useState([])
    const [imageEdit, setImageEdit] = useState(false)

    const [edit, setEdit] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // Query: Product Details  
    const { isLoading: queryLoading, refetch } = useQuery(["productEdit", ID], () => {
        return axios.get(`/api/products/edit/${ID}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setPID(data.data.pID)
            setPName(data.data.pName)
            setPSection(data.data.pSection)
            setPManufacturer(data.data.pManufacturer)
            setPDescription(data.data.pDescription)
            setHasOptions(!!data.data.optionGroup)
            setOptionGroup(data.data.optionGroup)
            setPDisplay(data.data.pDisplay)
            setImages(data.data.images)
            console.log(data.data.images)
            console.log(images)
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Mutation: Update Product
    const { mutate, isLoading: mutationLoading, reset } = useMutation(data => {
        return axios.put(`/api/products/edit/${ID}`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess("Product Update Success!")
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
        mutate({ pID, pName, pSection, pManufacturer, pDescription, optionGroup, pDisplay })
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
                            <Link to="/admin/productlist">{"<-- Product Page List"}</Link>
                        </Col>
                    </Row>
                    <h2 className="mt-3">Edit Product Page</h2>
                    {queryLoading ? <Loader />
                        : mutationLoading ? <Loader /> : (
                            <Form className="my-5" onSubmit={saveHandler}>
                                {error && <Message variant="danger">{error}</Message>}
                                {success && <Message variant="success">{success}</Message>}
                                <Form.Group controlId='Product ID'>
                                    <Form.Label>Product SKU</Form.Label>
                                    <Form.Control type='text' placeholder='Product SKU' value={pID} required disabled={true}
                                        onChange={(e) => setPID(e.target.value)}>
                                    </Form.Control>
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
                                    onChange={(e) => { setHasOptions(e.target.checked); setOptionGroup(null) }}>
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
                                    <>
                                        <Button variant='secondary' className="text-danger p-0" type="button"
                                            onClick={editHandler}>
                                            Edit
                                        </Button>
                                        <Button variant='secondary'
                                            onClick={() => setImageEdit(true)}>
                                            Edit Images
                                        </Button>
                                        <Modal show={imageEdit} onHide={() => setImageEdit(false)}
                                            backdrop="static" keyboard={false} size="xl"
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>Edit Product Images</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body> <ImageEditer images={images} pID={ID} /> </Modal.Body>
                                        </Modal>
                                    </>
                                )}
                            </Form>
                        )}
                </Col>
            </Row>
        </Container>
    )
}

export default ProductEditScreen




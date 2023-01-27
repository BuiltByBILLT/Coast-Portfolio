import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import ImageEditer from '../components/ImageEditer'
import Loader from '../components/Loader'
import Message from '../components/Message'
import OptionEditor from '../components/OptionEditor'
import { UserContext } from '../contexts/UserContext'
import { useHistory } from 'react-router-dom'

const ProductEditScreen = ({ match }) => {

    // States and Contexts
    const ID = match.params.id
    const history = useHistory()
    const user = useContext(UserContext)

    const [pID, setPID] = useState("")
    const [pName, setPName] = useState("")
    const [pSection, setPSection] = useState("")
    const [pManufacturer, setPManufacturer] = useState("")
    const [pDescription, setPDescription] = useState("")
    const [pPrice, setPPrice] = useState(0)
    const [pListPrice, setPListPrice] = useState(0)
    const [cloverID, setCloverID] = useState("")
    // const [pStock, setPStock] = useState(0)
    const [pDisplay, setPDisplay] = useState(false)

    const [hasOptions, setHasOptions] = useState(false)
    const [optionGroup, setOptionGroup] = useState("")
    const [options, setOptions] = useState([{}])

    const [images, setImages] = useState([])
    const [imageEdit, setImageEdit] = useState(false)

    const [edit, setEdit] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // Query: Product Details  
    const { isLoading: queryLoading, isError, refetch } = useQuery(["productEdit", ID], () => {
        return axios.get(`/api/products/edit/${ID}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: ({ data: { pID, pName, pSection, pManufacturer, pDescription, pPrice, pListPrice, pStock, cloverID, optionGroup, pDisplay, images, options } }) => {
            setPID(pID)
            setPName(pName)
            setPSection(pSection)
            setPManufacturer(pManufacturer)
            setPDescription(pDescription)
            setPPrice(pPrice)
            setPListPrice(pListPrice)
            setCloverID(cloverID)
            // setPStock(pStock)
            setPDisplay(pDisplay)
            setHasOptions(!!optionGroup)
            setOptionGroup(optionGroup)
            setOptions(options)
            setImages(images)
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Mutation: Update Product
    const { mutate, isLoading: mutationLoading, reset } = useMutation(data => {
        setEdit(false)
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
        if (hasOptions) {
            mutate({ pID, pName, pSection, pManufacturer, pDescription, pDisplay, pPrice: null, pListPrice: null, cloverID: null, optionGroup, options })
        } else {
            mutate({ pID, pName, pSection, pManufacturer, pDescription, pDisplay, pPrice, pListPrice, cloverID, optionGroup: null, options: [] })
        }
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
                    <Link to="/admin/productlist">{"<-- Product Page List"}</Link>
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
                                    <Form.Control as='textarea' placeholder='Description' value={pDescription} rows={5} disabled={!edit}
                                        onChange={(e) => setPDescription(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Row className='mx-0 my-4'>
                                    <Form.Check type="checkbox" id="displayCheck" className="" custom
                                        label="Display Product" disabled={!edit}
                                        checked={pDisplay}
                                        onChange={(e) => setPDisplay(e.target.checked)}>
                                    </Form.Check>
                                    <Form.Check type="checkbox" id="optionsCheck" className="mx-5" custom
                                        label="Has Options" disabled={!edit}
                                        checked={hasOptions}
                                        onChange={(e) => { setHasOptions(e.target.checked) }}>
                                    </Form.Check>
                                </Form.Row>
                                {hasOptions &&
                                    <Form.Group controlId='hasOptions'>
                                        <Form.Label>Option Group Text</Form.Label>
                                        <Form.Control type='text' placeholder='ex: Select Size' value={optionGroup} required disabled={!edit}
                                            onChange={(e) => setOptionGroup(e.target.value)}>
                                        </Form.Control>
                                    </Form.Group>
                                }
                                {hasOptions
                                    ? <OptionEditor options={options} setOptions={setOptions} edit={edit} />
                                    : <Form.Row className="mx-0 justify-content-between">
                                        <Form.Group className="w-50 pr-2">
                                            <Form.Label>CloverID</Form.Label>
                                            {edit
                                                ? <Form.Control type='text' value={cloverID || ""} required
                                                    onChange={(e) => setCloverID(e.target.value)}>
                                                </Form.Control>
                                                : <div onClick={() => { if (cloverID) history.push(`/admin/inventory/${cloverID}/edit`) }} >
                                                    <Form.Control type='text' value={cloverID || ""} disabled
                                                        style={{ cursor: cloverID ? "pointer" : "default" }}>
                                                    </Form.Control>
                                                </div>
                                            }
                                        </Form.Group>
                                        <Form.Group className="w-25 px-2">
                                            <Form.Label>Price (In Cents)</Form.Label>
                                            <Form.Control type='number' placeholder='' value={pPrice} required disabled={!edit}
                                                onChange={(e) => setPPrice(e.target.value)}>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group className="w-25 pl-2">
                                            <Form.Label>List Price (In Cents)</Form.Label>
                                            <Form.Control type='number' placeholder='(Optional)' value={pListPrice} disabled={!edit}
                                                onChange={(e) => setPListPrice(e.target.value)}>
                                            </Form.Control>
                                        </Form.Group>
                                        {/* <Form.Group>
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control type='number' placeholder='' value={pStock} required disabled={!edit}
                                        onChange={(e) => setPStock(e.target.value)}>
                                    </Form.Control>
                                </Form.Group> */}
                                    </Form.Row>
                                }
                                {edit ? (
                                    <Row className="mx-0">
                                        <Button variant='secondary' className="text-danger p-0" type="submit">
                                            Save
                                        </Button>
                                        <Button variant='secondary' className="p-0 ml-5" type="button"
                                            onClick={cancelHandler}>
                                            Cancel
                                        </Button>
                                    </Row>
                                ) : (
                                    <Row className="mx-0">
                                        <Button variant='secondary' className="text-danger p-0" type="button"
                                            onClick={editHandler} disabled={!pID}>
                                            Edit
                                        </Button>
                                        <Button variant='secondary' className="p-0 mx-3"
                                            onClick={() => setImageEdit(true)} disabled={!pID}>
                                            Edit Images
                                        </Button>
                                        <Modal show={imageEdit} onHide={() => setImageEdit(false)}
                                            backdrop="static" keyboard={false} size="xl"
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>Edit Product Images</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body> <ImageEditer images={images} pID={pID} /> </Modal.Body>
                                        </Modal>
                                    </Row>
                                )}
                            </Form>
                        )}
                </Col>
            </Row>
        </Container >
    )
}

export default ProductEditScreen




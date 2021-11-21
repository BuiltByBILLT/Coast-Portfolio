import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const InventoryEditScreen = ({ match }) => {

    // States and Contexts
    const ID = match.params.id
    const user = useContext(UserContext)

    const [cloverID, setCloverID] = useState("")
    const [cloverName, setCloverName] = useState("")
    const [iParent, setParent] = useState("")
    const [iStock, setStock] = useState(0)
    const [iPrice, setPrice] = useState(0)
    const [iListPrice, setListPrice] = useState(0)
    const [isOption, setIsOption] = useState(false)
    const [iSelectionName, setSelectionName] = useState("")
    const [iSell, setSell] = useState(false)

    const [edit, setEdit] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // Query: Inventory Details  
    const { isLoading: queryLoading, error: queryError, refetch } = useQuery(["InventoryEdit", ID], () => {
        return axios.get(`/api/inventory/edit/${ID}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setCloverID(data.data.cloverID)
            setCloverName(data.data.cloverName)
            setParent(data.data.iParent)
            setStock(data.data.iStock)
            setPrice(data.data.iPrice)
            setListPrice(data.data.iListPrice)
            setIsOption(!!data.data.iSelectionName)
            setSelectionName(data.data.iSelectionName)
            setSell(data.data.iSell)
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Mutation: Update Product
    const { mutate, isLoading: mutationLoading, reset } = useMutation(data => {
        return axios.put(`/api/inventory/edit/${ID}`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess("Inventory Update Success!")
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
        mutate({ cloverID, cloverName, iParent, iStock, iPrice, iListPrice, iSelectionName, iSell })
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
                            <Link to="/admin/inventorylist">{"<-- Inventory List"}</Link>
                        </Col>
                    </Row>
                    <h2 className="mt-3">Edit Inventory</h2>
                    {queryLoading ? <Loader />
                        : mutationLoading ? <Loader /> : (
                            <Form className="my-5" onSubmit={saveHandler}>
                                {error && <Message variant="danger">{error}</Message>}
                                {success && <Message variant="success">{success}</Message>}
                                <Form.Group controlId='Product ID'>
                                    <Form.Label>Clover ID</Form.Label>
                                    <Form.Control type='text' placeholder='Clover ID' value={cloverID} required disabled={true}
                                        onChange={(e) => setCloverID(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Name'>
                                    <Form.Label>Clover Name</Form.Label>
                                    <Form.Control type='text' placeholder='Name' value={cloverName} required disabled={!edit}
                                        onChange={(e) => setCloverName(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Parent Page'>
                                    <Form.Label>Parent Page</Form.Label>
                                    <Form.Control type='text' placeholder='Parent Page' value={iParent} disabled={!edit}
                                        onChange={(e) => setParent(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Stock'>
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control type='number' placeholder='Stock' value={iStock} required disabled={!edit}
                                        onChange={(e) => setStock(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Price'>
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type='number' placeholder='Price' value={iPrice} required disabled={!edit}
                                        onChange={(e) => setPrice(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='List Price'>
                                    <Form.Label>List Price</Form.Label>
                                    <Form.Control type='number' placeholder='List Price' value={iListPrice} disabled={!edit}
                                        onChange={(e) => setListPrice(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Check type="checkbox" id="optionsCheck" className="mb-3" custom
                                    label="Is An Option" disabled={!edit}
                                    checked={isOption}
                                    onChange={(e) => { setIsOption(e.target.checked); setSelectionName(null) }}>
                                </Form.Check>
                                {isOption && <Form.Group controlId='isOption'>
                                    <Form.Label>Variation Name</Form.Label>
                                    <Form.Control type='text' placeholder='ex: 2oz' value={iSelectionName} required disabled={!edit}
                                        onChange={(e) => setSelectionName(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>}
                                <Form.Check type="checkbox" id="sellCheck" className="mb-3" custom
                                    label="Sell" disabled={!edit}
                                    checked={iSell}
                                    onChange={(e) => setSell(e.target.checked)}>
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

export default InventoryEditScreen


// const [imageEdit, setImageEdit] = useState(false)

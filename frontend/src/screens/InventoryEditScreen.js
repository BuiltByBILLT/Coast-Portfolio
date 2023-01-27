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
    const [cloverPrice, setCloverPrice] = useState("")
    const [cloverSku, setCloverSku] = useState("")
    const [iStock, setStock] = useState(0)
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
        onSuccess: ({ data: { cloverID, cloverName, cloverPrice, cloverSku, iStock, iSell } }) => {
            // console.log(data.data)
            setCloverID(cloverID)
            setCloverName(cloverName)
            setCloverPrice(cloverPrice)
            setCloverSku(cloverSku)
            setStock(iStock)
            setSell(iSell)
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Mutation: Update Inventory
    const { mutate, isLoading: mutationLoading, reset } = useMutation(data => {
        return axios.put(`/api/inventory/edit/${ID}`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            // console.log(data.data)
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
        mutate({ cloverID, cloverName, cloverPrice, cloverSku, iStock, iSell })
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
                                <Form.Group controlId='Price'>
                                    <Form.Label>Clover POS Price *NOT Website Price* (In Cents)</Form.Label>
                                    <Form.Control type='number' placeholder='Price from Clover POS (In Cents)' value={cloverPrice} required disabled={!edit}
                                        onChange={(e) => setCloverPrice(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Sku'>
                                    <Form.Label>Clover POS SKU *NOT Website SKU* (Optional)</Form.Label>
                                    <Form.Control type='text' placeholder='Sku from Clover POS' value={cloverSku} disabled={!edit}
                                        onChange={(e) => setCloverSku(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Stock'>
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control type='number' placeholder='Stock' value={iStock} required disabled={!edit}
                                        onChange={(e) => setStock(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
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
                                        disabled={!cloverID}
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

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const InventoryNewScreen = ({ history }) => {

    // States and Contexts
    const user = useContext(UserContext)

    // const [cloverID, setCloverID] = useState("")
    const [cloverName, setCloverName] = useState("")
    const [cloverPrice, setCloverPrice] = useState("")
    const [cloverSku, setCloverSku] = useState("")
    const [iStock, setStock] = useState(0)
    const [iSell, setSell] = useState(false)

    const [edit, setEdit] = useState(true)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")


    // Mutation: New Inv
    const { mutate, isLoading: mutationLoading, reset } = useMutation(data => {
        return axios.post(`/api/inventory/new`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess(`Inventory Item ${data.data.cloverID} Created!`)
            setError("")
            setEdit(false)
            reset()
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })


    // Handlers
    const saveHandler = (e) => {
        e.preventDefault()
        mutate({ cloverName, cloverSku, cloverPrice, cloverSku, iStock, iSell })
    }
    const cancelHandler = (e) => {
        e.preventDefault()
        history.push('/admin/inventorylist')
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
                    <h2 className="mt-3">New Inventory Page</h2>
                    {mutationLoading ? <Loader /> : (
                        <Form className="my-5" onSubmit={saveHandler}>
                            {error && <Message variant="danger">{error}</Message>}
                            {success && <Message variant="success">{success}</Message>}
                            {/* <Form.Group controlId='Product ID'>
                                    <Form.Label>Clover ID</Form.Label>
                                    <Form.Control type='text' placeholder='Clover ID' value={cloverID} required disabled={true}
                                        onChange={(e) => setCloverID(e.target.value)}>
                                    </Form.Control>
                                </Form.Group> */}
                            <Form.Group controlId='Name'>
                                <Form.Label>Clover Name</Form.Label>
                                <Form.Control type='text' placeholder='Name' value={cloverName} required disabled={!edit}
                                    onChange={(e) => setCloverName(e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='Price'>
                                <Form.Label>Clover POS Price *NOT Website Price* (In Cents)</Form.Label>
                                <Form.ContCloverrol type='number' placeholder='Price (In Cents)' value={cloverPrice} required disabled={!edit}
                                    onChange={(e) => setCloverPrice(e.target.value)}>
                                </Form.ContCloverrol>
                            </Form.Group>
                            <Form.Group controlId='Sku'>
                                <Form.Label>Clover POS SKU *NOT Website SKU* (Optional)</Form.Label>
                                <Form.Control type='text' placeholder='Sku Page' value={cloverSku} disabled={!edit}
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
                            {edit && (
                                <>
                                    <Button variant='secondary' className="text-danger p-0" type="submit"
                                        disabled={!cloverName || !cloverPrice}>
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

export default InventoryNewScreen

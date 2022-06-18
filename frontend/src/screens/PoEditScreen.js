import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'
import PoSearchModal from '../components/PoSearchModal'
import CloverIdModal from '../components/CloverIdModal'

const PoEditScreen = ({ match }) => {

    const history = useHistory()
    const id = match.params.id

    // States and Contexts
    const user = useContext(UserContext)

    const [lineItem, setLineItem] = useState({})
    const [lineItems, setLineItems] = useState([])
    const [form, setForm] = useState({})

    const [show, setShow] = useState(false)
    const [elementID, setElementID] = useState("")
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    const myTable = useRef()

    useEffect(() => { console.log(myTable.current) }, [myTable.current])



    // Get PO Info
    const { data: poData, refetch } = useQuery(id, () => {
        return axios.get(`/api/pos/edit/${id}`, { headers: { Authorization: `Bearer ${user.token}` } })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setForm(data.data)
            setLineItems(data.data.lineItems)
        }
    })
    const complete = poData?.data?.status == "COMPLETE" ? true : false

    // Get Merchant Info
    const { data: merchantData } = useQuery("poMerchant", () => {
        console.log(poData.data.merchantName)
        return axios.get(`/api/merchants/${poData.data.merchantName}`, { headers: { Authorization: `Bearer ${user.token}` } })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            console.log(lineItems)
        },
        enabled: !!poData?.data?.merchantName
    })

    // Mutation: Save PO
    const { mutate, isLoading } = useMutation(tableItems => {
        setSuccess("")
        setError("")
        return axios.put(`/api/pos/edit/${id}`,
            { lineItems: tableItems, status: "COMPLETE", merchantName: poData.data.merchantName },
            { headers: { Authorization: `Bearer ${user.token}` } })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setForm(data.data)
            setSuccess("Success!")
            setError("")
            window.scroll({ top: 0 })
            refetch()
        },
        onError: (error) => {
            window.scroll({ top: 0 })
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Handlers
    const fillHandler = (sku, description, price) => {
        setLineItem({ sku, description, price })
    }

    const addHandler = (e) => {
        e.preventDefault()
        setLineItems([lineItem, ...lineItems])
        setLineItem({})
    }

    const deleteHandler = (deleteID) => {
        setLineItems(lineItems.filter(line => line.sku !== deleteID))
    }

    const cloverHandler = (cloverID) => {
        document.getElementById(elementID).innerText = cloverID
    }

    const saveHandler = () => {
        setError("")
        const tableItems = Array.from(myTable.current.rows).slice(1)
            .map((row) => {
                return {
                    // row.cells
                    cloverID: row.cells[0].innerText,
                    sku: row.cells[1].innerText,
                    description: row.cells[2].innerText,
                    qty: Number(row.cells[3].innerText),
                    price: Number(row.cells[4].innerText),
                }
            })
        // console.log(listItems)
        mutate(tableItems)
    }

    const cancelHandler = (e) => {
        e.preventDefault()
        history.push('/admin/polist')
    }

    return (
        <Container className="my-5 pb-5">
            <CloverIdModal show={show} setShow={setShow} elementID={elementID} fillHandler={cloverHandler} />
            <Link to="/admin/polist">{"<-- Purchase Orders List"}</Link>
            <h2 className="my-3">{complete ? "Purchase Order" : "Edit Purchase Order"}</h2>

            {error && <Message variant="danger">{error}</Message>}
            {success && <Message variant="success">{success}</Message>}
            <Form className="my-4 pb-3" onSubmit={() => { }}>
                <Row>
                    <Col xs={6}>
                        <Form.Label>Merchant Name:</Form.Label>
                        <Form.Control placeholder='Merchant Name' value={form.merchantName || ""} disabled>
                        </Form.Control>
                    </Col>
                    <Col xs={6}>
                        <Form.Label>Purchase Order Date:</Form.Label>
                        <Form.Control value={form.poDate || ""} disabled>
                        </Form.Control>
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col xs={6}>
                        <Form.Label>Merchant Email:</Form.Label>
                        <Form.Control placeholder='Merchant Email' value={form.merchantEmail || ""} disabled>
                        </Form.Control>
                    </Col>
                    <Col xs={6}>
                        <Form.Label>Reply To Email:</Form.Label>
                        <Form.Control placeholder='Reply To Email' value={form.replyToEmail || ""} disabled>
                        </Form.Control>
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col>
                        <Form.Label>Merchant Address:</Form.Label>
                        <Form.Control placeholder='Merchant Address' value={form.merchantAddress || ""} disabled>
                        </Form.Control>
                    </Col>
                    <Col>
                        <Form.Label>Ship To Address:</Form.Label>
                        <Form.Control placeholder='Ship To Address' value={form.shipToAddress || ""} disabled>
                        </Form.Control>
                    </Col>
                </Row>
            </Form>
            {!complete && <Form onSubmit={addHandler} style={{ borderBottom: "3px solid black" }} className="pb-4 mb-4">
                <Row style={{ borderBottom: "3px solid black" }} className="mx-0 my-4 pb-1">
                    <Col xs="auto">
                        <h4 className="my-1" >Add Line Item:</h4>
                    </Col>
                    <Col xs="auto" className="ml-auto pr-0">
                        <Button variant='outline-danger' className="py-0" type="submit" >
                            Add
                        </Button>
                    </Col>
                </Row>
                <Form.Row>
                    <Col xs={2}>
                        <Form.Control type='text' placeholder='Product ID / SKU' value={lineItem.sku || ""} required
                            onChange={(e) => setLineItem({ ...lineItem, sku: e.target.value })}>
                        </Form.Control>
                    </Col>
                    <Col xs={5}>
                        <Form.Control type='text' placeholder='Description' value={lineItem.description || ""} required
                            onChange={(e) => setLineItem({ ...lineItem, description: e.target.value })}>
                        </Form.Control>
                    </Col>
                    <Col xs={1}>
                        <Form.Control type='text' placeholder='Qty' value={lineItem.qty || ""} required
                            onChange={(e) => setLineItem({ ...lineItem, qty: e.target.value })}>
                        </Form.Control>
                    </Col>
                    <Col xs={2}>
                        <Form.Control type='text' placeholder='Rate' value={lineItem.price || ""} required
                            onChange={(e) => setLineItem({ ...lineItem, price: e.target.value })}>
                        </Form.Control>
                    </Col>
                    <Col xs={2}>
                        <Form.Control type='text' placeholder='Total' value={lineItem.price * lineItem.qty || ""} disabled>
                        </Form.Control>
                    </Col>
                </Form.Row>
                <Row>
                    <Col xs={6}>
                    </Col>
                </Row>
            </Form>}
            <Table striped bordered hover ref={myTable}>
                <thead>
                    <tr>
                        <th>Clover ID</th>
                        <th>Sku</th>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Extended</th>
                        {!complete && <th></th>}
                    </tr>
                </thead>
                <tbody>
                    {lineItems.map(line => (
                        <tr key={line.sku}>
                            <td className="py-3" id={line.sku}
                                onClick={() => { setShow(true); setElementID(line.sku) }}
                            >{line.cloverID}</td>
                            <td className="py-3" contentEditable={!complete} >{line.sku}</td>
                            <td className="py-3" contentEditable={!complete} >{line.description}</td>
                            <td className="py-3" contentEditable={!complete} >{line.qty}</td>
                            <td className="py-3" contentEditable={!complete} >{line.price}</td>
                            <td className="py-3">{line.price * line.qty || ""}</td>
                            {!complete && <td className="p-0  align-middle text-center">
                                <Button variant='danger' className='btn-sm'
                                    onClick={() => deleteHandler(line.sku)}>
                                    <i className='fas fa-trash'></i>
                                </Button>
                            </td>}
                        </tr>
                    ))}
                </tbody>
            </Table>
            {!complete && <Button variant='danger' className="mr-3" type="button" disabled={lineItems.length === 0 || isLoading}
                onClick={saveHandler}>
                {isLoading ? "Loading" : "Save and Update Stock"}
            </Button>}
            <Button variant='secondary' className=" " type="button"
                onClick={cancelHandler}>
                {complete ? "Back" : "Cancel"}
            </Button>

        </Container >
    )
}

export default PoEditScreen

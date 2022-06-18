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

const PoNewScreen = () => {

    const history = useHistory()
    // States and Contexts
    const user = useContext(UserContext)

    const [merchants, setMerchants] = useState([])
    const [selected, setSelected] = useState('0')

    const poDate = new Date().toLocaleDateString('en-US')
    const coast = "Coast Airbrush, LLC. 312 N Anaheim Blvd. Anaheim, CA 92805"
    const sprinkles = "hello@sprinklesmedia.com"
    const [emailHtml, setEmailHtml] = useState("")
    const [lineItem, setLineItem] = useState({})
    const [lineItems, setLineItems] = useState([])
    const [form, setForm] = useState({ shipToAddress: coast, replyToEmail: sprinkles })

    const [show, setShow] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    const myTable = useRef();
    useEffect(() => { setEmailHtml(myTable.current && myTable.current.outerHTML) }, [lineItems, myTable]);

    useEffect(() => {
        // setSuccess("")
        setLineItems([])
        setForm({ shipToAddress: coast, replyToEmail: sprinkles })
    }, [selected])

    // Get Merchant List
    const { refetch } = useQuery('merchants', () => {
        return axios.get(`/api/merchants`, { headers: { Authorization: `Bearer ${user.token}` } })
    }, {
        onSuccess: (data) => { setMerchants(data.data) }
    })

    // Get Single Merchant Info
    const { data: merchantData } = useQuery(selected, () => {
        return axios.get(`/api/merchants/${selected}`, { headers: { Authorization: `Bearer ${user.token}` } })
    }, {
        onSuccess: (data) => {
            const { merchantEmail, merchantAddress, replyToEmail, shipToAddress } = data.data
            if (shipToAddress) setForm({ ...form, shipToAddress })
            setForm({ ...form, merchantEmail: merchantEmail, merchantAddress: merchantAddress })
        },
        enabled: selected != '0'
    })

    // Mutation: New PO
    const { mutate, isLoading: mutationLoading, reset } = useMutation(body => {
        setSuccess("")
        setError("")
        return axios.post(`/api/pos`, body, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            setSuccess("Purchase Order Sent!")
            setError("")
            setForm({ shipToAddress: coast })
            setLineItem({})
            setLineItems([])
            setSelected('0')
            reset()
            window.scroll({ top: 0 })
            console.log(data.data)
        },
        onError: (error) => {
            window.scroll({ top: 0 })
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Handlers
    const fillHandler = (sku, description, price, cloverID) => {
        setLineItem({ sku, description, price, cloverID })
    }

    const addHandler = (e) => {
        e.preventDefault()
        setLineItems([...lineItems, lineItem])
        setLineItem({})
    }

    const deleteHandler = (deleteID) => {
        setLineItems(lineItems.filter(line => line.sku !== deleteID))
    }

    const sendHandler = () => { mutate({ ...form, merchantName: selected, lineItems, emailHtml, poDate }) }

    const cancelHandler = (e) => {
        e.preventDefault()
        history.push('/admin/polist')
    }

    return (
        <Container className="my-5 pb-5">
            <Link to="/admin/polist">{"<-- Purchase Orders List"}</Link>
            <h2 className="my-3">New Purchase Order</h2>
            {mutationLoading ? <Loader />
                : (<>
                    {error && <Message variant="danger">{error}</Message>}
                    {success && <Message variant="success">{success}</Message>}
                    <Form className="my-4 pb-3" onSubmit={addHandler} style={{ borderBottom: "3px solid black" }}>
                        <Row>
                            <Col xs={6}>
                                <Form.Label>Select Merchant:</Form.Label>
                                <Form.Control as="select" value={selected}
                                    onChange={(e) => setSelected(e.target.value)}>
                                    <option key={0} value={0} disabled>Select Merchant</option>
                                    {merchants.map((merchant) => (
                                        <option key={merchant} value={merchant}>{merchant}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                            <Col xs={6}>
                                <Form.Label>Purchase Order Date:</Form.Label>
                                <Form.Control placeholder={poDate} disabled />
                            </Col>
                        </Row>
                        <Row className="my-3">
                            <Col xs={6}>
                                <Form.Label>Merchant Email:</Form.Label>
                                <Form.Control placeholder='Merchant Email' value={form.merchantEmail || ""} required
                                    onChange={(e) => setForm({ ...form, merchantEmail: e.target.value })}>
                                </Form.Control>
                            </Col>
                            <Col xs={6}>
                                <Form.Label>Reply To Email:</Form.Label>
                                <Form.Control placeholder='Reply To Email' value={form.replyToEmail || ""} required disabled
                                    onChange={(e) => setForm({ ...form, replyToEmail: e.target.value })}>
                                </Form.Control>
                            </Col>
                        </Row>
                        <Row className="my-3">
                            <Col>
                                <Form.Label>Merchant Address:</Form.Label>
                                <Form.Control placeholder='Merchant Address' value={form.merchantAddress || ""} required
                                    onChange={(e) => setForm({ ...form, merchantAddress: e.target.value })}>
                                </Form.Control>
                            </Col>
                            <Col>
                                <Form.Label>Ship To Address:</Form.Label>
                                <Form.Control placeholder='Ship To Address' value={form.shipToAddress || ""} required
                                    onChange={(e) => setForm({ ...form, shipToAddress: e.target.value })}>
                                </Form.Control>
                            </Col>
                        </Row>

                        <Row style={{ borderBottom: "3px solid black" }} className="mx-0 my-4 pb-1">
                            <Col xs="auto">
                                <h4 className="my-1" >Add Line Item:</h4>
                            </Col>
                            <Col>
                                <Button variant='outline-primary' className="py-0" type="button"
                                    onClick={() => setShow(true)} disabled={selected == '0'}>
                                    Search
                                </Button>
                                <PoSearchModal show={show} setShow={setShow} merchantData={merchantData} fillHandler={fillHandler} />
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
                    </Form>
                    <Table striped bordered hover ref={myTable}>
                        <thead>
                            <tr>
                                <th>Product Sku</th>
                                <th>Product Description</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Extended</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineItems.map(line => (
                                <tr key={line.sku}>
                                    <td className="py-3">{line.sku}</td>
                                    <td className="py-3">{line.description}</td>
                                    <td className="py-3">{line.qty}</td>
                                    <td className="py-3">{line.price}</td>
                                    <td className="py-3">{line.price * line.qty || ""}</td>
                                    <td className="p-0  align-middle text-center">
                                        <Button variant='danger' className='btn-sm'
                                            onClick={() => deleteHandler(line.sku)}>
                                            <i className='fas fa-trash'></i>
                                        </Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button variant='danger' className="" type="button" disabled={lineItems.length === 0}
                        onClick={sendHandler}>
                        Send Email
                    </Button>
                    <Button variant='secondary' className=" ml-5" type="button"
                        onClick={cancelHandler}>
                        Cancel
                    </Button>
                </>)
            }
        </Container >
    )
}

export default PoNewScreen

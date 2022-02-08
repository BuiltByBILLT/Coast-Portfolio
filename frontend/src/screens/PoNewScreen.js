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

    const [poEmail, setPoEmail] = useState("")
    const [poVender, setPoVender] = useState("")
    const [poShipTo, setPoShipTo] = useState("Coast Airbrush, LLC. 312 N Anaheim Blvd. Anaheim, CA 92805")
    const [poText, setPoText] = useState("")
    const [poHtml, setPoHtml] = useState("")
    const [poLines, setPoLines] = useState([])
    const [lineCloverID, setLineCloverID] = useState("")
    const [lineSku, setLineSku] = useState("")
    const [lineQty, setLineQty] = useState("")
    const [lineRate, setLineRate] = useState("")
    const [lineName, setLineName] = useState("")

    const [show, setShow] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")


    // Mutation: New PO
    const { mutate, isLoading: mutationLoading, reset } = useMutation(data => {
        return axios.post(`/api/pos`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess("Purchase Order Sent!")
            setError("")
            setPoEmail("")
            setPoVender("")
            setPoShipTo("Coast Airbrush, LLC. 312 N Anaheim Blvd. Anaheim, CA 92805")
            setPoText("")
            setPoHtml("")
            setPoLines([])
            reset()
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Handlers
    const fillHandler = (cloverID, pID, name) => {
        setLineCloverID(cloverID)
        setLineSku(pID)
        setLineName(name)
    }

    const addHandler = (e) => {
        e.preventDefault()
        setPoLines([...poLines, { lineCloverID, lineSku, lineQty, lineRate, lineName }])
        setLineCloverID("")
        setLineSku("")
        setLineQty("")
        setLineRate("")
        setLineName("")

    }

    const deleteHandler = (deleteID) => {
        setPoLines(poLines.filter(line => line.lineCloverID !== deleteID))
    }

    const sendHandler = () => {
        setSuccess("")
        setError("")
        mutate({ poEmail, poVender, poShipTo, poText, poHtml, poLines })
    }

    const cancelHandler = (e) => {
        e.preventDefault()
        history.push('/admin/polist')
    }

    const myTable = useRef();
    useEffect(() => {
        setPoHtml(myTable.current.outerHTML)
        console.log(myTable.current.outerHTML)
    }, [poLines]);



    return (
        <Container className="my-5 pb-5">
            <Link to="/admin/polist">{"<-- Product Orders List"}</Link>
            <h2 className="my-3">New Product Order</h2>



            {
                mutationLoading ? <Loader />
                    : (<>
                        {error && <Message variant="danger">{error}</Message>}
                        {success && <Message variant="success">{success}</Message>}
                        <Form className="my-4 pb-3" onSubmit={addHandler} style={{ borderBottom: "3px solid black" }}>
                            <Row>
                                <Col xs={6}>
                                    <Form.Group controlId='Email'>
                                        <Form.Label>Vender Email:</Form.Label>
                                        <Form.Control placeholder='Vender Email' value={poEmail} required
                                            onChange={(e) => setPoEmail(e.target.value)}>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId='From'>
                                        <Form.Label>Vender Address:</Form.Label>
                                        <Form.Control placeholder='Vender Address' value={poVender} required
                                            onChange={(e) => setPoVender(e.target.value)}>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='To'>
                                        <Form.Label>Ship To:</Form.Label>
                                        <Form.Control placeholder='Ship To' value={poShipTo} required
                                            onChange={(e) => setPoShipTo(e.target.value)}>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row style={{ borderBottom: "3px solid black" }} className="mx-0 my-3 pb-1">
                                <Col xs="auto">
                                    <h4 className="my-1" >Add Line Item:</h4>
                                </Col>
                                <Col>
                                    {/* <div onClick={() => setShow(true)}> */}
                                    {/* <Form.Control placeholder="search" disabled> </Form.Control> */}
                                    {/* </div> */}
                                    <Button variant='outline-primary' className="py-0" type="button"
                                        onClick={() => setShow(true)}>
                                        Search
                                    </Button>
                                    <PoSearchModal show={show} setShow={setShow} fillHandler={fillHandler} />
                                </Col>
                                <Col xs="auto" className="ml-auto pr-0">
                                    <Button variant='outline-danger' className="py-0" type="submit" >
                                        Add
                                    </Button>
                                </Col>
                            </Row>
                            <Form.Row>
                                <Col xs={2}>
                                    <Form.Control type='text' placeholder='Clover ID' value={lineCloverID} required
                                        onChange={(e) => setLineCloverID(e.target.value)}>
                                    </Form.Control>
                                </Col>
                                <Col xs={2}>
                                    <Form.Control type='text' placeholder='Product ID / SKU' value={lineSku} required
                                        onChange={(e) => setLineSku(e.target.value)}>
                                    </Form.Control>
                                </Col>
                                <Col xs={5}>
                                    <Form.Control type='text' placeholder='Description' value={lineName} required
                                        onChange={(e) => setLineName(e.target.value)}>
                                    </Form.Control>
                                </Col>
                                <Col xs={1}>
                                    <Form.Control type='text' placeholder='Qty' value={lineQty} required
                                        onChange={(e) => setLineQty(e.target.value)}>
                                    </Form.Control>
                                </Col>
                                <Col xs={1}>
                                    <Form.Control type='text' placeholder='Rate' value={lineRate}
                                        onChange={(e) => setLineRate(e.target.value)}>
                                    </Form.Control>
                                </Col>
                                <Col xs={1}>
                                    <Form.Control type='text' placeholder='Total' value={lineRate * lineQty || ""} disabled>
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
                                {poLines.map(line => (
                                    <tr key={line.lineCloverID}>
                                        <td className="py-3">{line.lineSku}</td>
                                        <td className="py-3">{line.lineName}</td>
                                        <td className="py-3">{line.lineQty}</td>
                                        <td className="py-3">{line.lineRate}</td>
                                        <td className="py-3">{line.lineRate * line.lineQty || ""}</td>
                                        <td className="p-0  align-middle text-center">
                                            <Button variant='danger' className='btn-sm'
                                                onClick={() => deleteHandler(line.lineCloverID)}>
                                                <i className='fas fa-trash'></i>
                                            </Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button variant='danger' className="" type="button" disabled={poLines.length === 0}
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

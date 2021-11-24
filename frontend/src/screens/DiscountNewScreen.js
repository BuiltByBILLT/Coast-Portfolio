import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const DiscountNewScreen = ({ popup }) => {

    const history = useHistory()
    // States and Contexts
    const user = useContext(UserContext)

    const [discountCode, setDiscountCode] = useState("")
    const [discountDescription, setDiscountDescription] = useState("")
    const [discountType, setDiscountType] = useState("FLAT")
    const [discountAmount, setDiscountAmount] = useState("")
    const [discountLive, setDiscountLive] = useState(true)
    const [discountExclude, setDiscountExclude] = useState("")

    const [available, setAvailable] = useState(true)
    const [edit, setEdit] = useState(true)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // Query: All Categories  
    const { isLoading: queryLoading, data: queryData } = useQuery("discountListAdmin", () => {
        return axios.get(`/api/discounts`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Mutation: New Discount
    const { mutate, isLoading: mutationLoading, reset } = useMutation(data => {
        return axios.post(`/api/discounts/edit/${discountCode}`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess("Discount Creation Success!")
            setError("")
            setEdit(false)
            reset()
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Effect: Check if Discount ID is already Taken
    useEffect(() => {
        if (queryData && queryData.data) {
            const match = queryData.data.filter(discount => discount.discountCode == discountCode)
            if (match.length) setAvailable(false)
            else setAvailable(true)
        }
        if (discountCode == "") setAvailable(true)
    }, [discountCode, queryData])

    // Handlers
    const saveHandler = (e) => {
        e.preventDefault()
        mutate({ discountDescription, discountCode, discountAmount, discountType, discountLive, discountExclude })
    }
    const cancelHandler = (e) => {
        e.preventDefault()
        history.push('/admin/discountlist')
    }

    const excludeHandler = (e) => {
        setDiscountExclude(e.target.value)
    }


    return (
        <Container className={popup ? "" : "my-5 pb-5"}>
            <Row>
                <Col xs={popup ? 12 : 8}>
                    <Row>
                        <Col>
                            <Link to="/admin/discountlist">{"<-- Discount List"}</Link>
                        </Col>
                    </Row>
                    <h2 className="mt-3">New Discount</h2>
                    {queryLoading ? <Loader />
                        : mutationLoading ? <Loader /> : (
                            <Form className="my-5" onSubmit={saveHandler}>
                                {error && <Message variant="danger">{error}</Message>}
                                {success && <Message variant="success">{success}</Message>}
                                <Form.Group controlId='SectionID'>
                                    <Form.Label>Discount ID</Form.Label>
                                    <Form.Control type='text' placeholder='Discount ID' value={discountCode} required disabled={!edit}
                                        isInvalid={!available}
                                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {discountCode} is already in use
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId='Name'>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control type='text' placeholder='Name' value={discountDescription} required disabled={!edit}
                                        onChange={(e) => setDiscountDescription(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Type'>
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control as='select' placeholder='Type' value={discountType} required disabled={!edit}
                                        onChange={(e) => { setDiscountType(e.target.value); console.log(e.target.value) }}>
                                        <option value="PERCENT">PERCENT</option>
                                        <option value="FLAT">FLAT</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Amount Off'>
                                    <Form.Label>{discountType == 'FLAT' ? 'Amount Off (Cents)' : "Percent Off"}</Form.Label>
                                    <Form.Control type='number' placeholder={discountType == 'FLAT' ? 'Amount Off In Cents' : "Percent Off"}
                                        value={discountAmount} required disabled={!edit}
                                        onChange={(e) => setDiscountAmount(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Exclude'>
                                    <Form.Label>{discountType == 'FLAT' ? "Minimun Order (Cents)" : "Excluded Products"}</Form.Label>
                                    <Form.Control
                                        as={discountType == 'FLAT' ? "input" : 'textarea'}
                                        type={discountType == 'FLAT' ? "number" : 'textarea'}
                                        placeholder={discountType == 'FLAT' ? "Minimun Order Value (Cents)"
                                            : `Product SKU's Seperated by Commas, No Spaces
                                        ex: T6131,126823,50-0231`}
                                        value={discountExclude} disabled={!edit}
                                        onChange={excludeHandler}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Check label="Discount Live" disabled={!edit}
                                    type="checkbox" id="disabledCheck" className="mb-3" custom
                                    checked={discountLive}
                                    onChange={(e) => setDiscountLive(e.target.checked)}>
                                </Form.Check>
                                {edit && (
                                    <>
                                        <Button variant='secondary' className="text-danger p-0" type="submit" disabled={!available}>
                                            Save
                                        </Button>
                                        <Button variant='secondary' className="p-0 ml-5" type="button"
                                            onClick={popup ? () => { } : cancelHandler}>
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </Form>
                        )}
                </Col>
            </Row>
        </Container >
    )
}

export default DiscountNewScreen

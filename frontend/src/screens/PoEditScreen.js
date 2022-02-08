import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const PoEditScreen = ({ match }) => {

    // States and Contexts
    const ID = match.params.id
    const user = useContext(UserContext)

    const [discountCode, setDiscountCode] = useState(ID)
    const [discountDescription, setDiscountDescription] = useState("")
    const [discountType, setDiscountType] = useState("")
    const [discountAmount, setDiscountAmount] = useState("")
    const [discountLive, setDiscountLive] = useState(true)
    const [discountExclude, setDiscountExclude] = useState("")
    const [categoryExclude, setCategoryExclude] = useState("")

    const [edit, setEdit] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // Query: Get Details
    const { isLoading: queryLoading, refetch } = useQuery([`discountEdit`, ID], () => {
        return axios.get(`/api/discounts/edit/${ID}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setDiscountDescription(data.data.discountDescription)
            setDiscountType(data.data.discountType)
            setDiscountAmount(data.data.discountAmount)
            setDiscountCode(data.data.discountCode)
            setDiscountLive(data.data.discountLive)
            setDiscountExclude(data.data.discountExclude)
            setCategoryExclude(data.data.categoryExclude)
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Mutation: Update Discount 
    const { mutate, isLoading: mutationLoading, reset } = useMutation(data => {
        return axios.put(`/api/discounts/edit/${ID}`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess("Discount Update Success")
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
        mutate({
            discountDescription, discountCode, discountAmount, discountType, discountLive,
            discountExclude, categoryExclude
        })
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
    const excludeHandler = (e) => {
        setDiscountExclude(e.target.value)
    }
    const categoryHandler = (e) => {
        setCategoryExclude(e.target.value)
    }


    return (
        <Container className="my-5 pb-5">
            <Row>
                <Col xs={8}>
                    <Row>
                        <Col>
                            <Link to="/admin/discountlist">{"<-- Discount List"}</Link>
                        </Col>
                        <Col className="text-right">
                            {/* <Link to={`/discount/${ID}`}>{"Go to Discount -->"}</Link> */}
                        </Col>
                    </Row>
                    <h2 className="mt-3">Edit Discount</h2>
                    {queryLoading ? <Loader />
                        : mutationLoading ? <Loader /> : (
                            <Form className="my-5" onSubmit={saveHandler}>
                                {error && <Message variant="danger">{error}</Message>}
                                {success && <Message variant="success">{success}</Message>}
                                <Form.Group controlId='SectionID'>
                                    <Form.Label>Discount CODE</Form.Label>
                                    <Form.Control type='text' placeholder='Discount ID' value={discountCode} required disabled={true}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Name'>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control type='text' placeholder='Name' value={discountDescription} disabled={!edit}
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
                                    <Form.Label>{discountType == 'FLAT' ? 'Amount Off In Cents' : "Percent Off"}</Form.Label>
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
                                {discountType == 'PERCENT' &&
                                    <Form.Group controlId='CategoryExclude'>
                                        <Form.Label>Excluded Categories</Form.Label>
                                        <Form.Control
                                            as='textarea'
                                            type='textarea'
                                            placeholder={`Category ID's Seperated by Commas, No Spaces
                                        ex: 3,56,217`}
                                            value={categoryExclude} disabled={!edit}
                                            onChange={categoryHandler}>
                                        </Form.Control>
                                    </Form.Group>
                                }
                                <Form.Check label="Discount Live" disabled={!edit}
                                    type="checkbox" id="disabledCheck" className="mb-3" custom
                                    checked={discountLive}
                                    onChange={(e) => setDiscountLive(e.target.checked)}>
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

export default PoEditScreen

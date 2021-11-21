import React, { useState, useContext } from 'react'
import { UserContext, UserContextUpdate } from '../contexts/UserContext'
import { useMutation } from 'react-query'
import axios from 'axios'

import { Form, Button, Row, Col } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'

const EditAddress = () => {

    const user = useContext(UserContext)
    const updateUser = useContext(UserContextUpdate)

    const initialState = user.address ? user.address : {
        company: "",
        address1: "",
        address2: "",
        city: "",
        region: "",
        country: "",
        postalCode: "",
        phone: ""
    }

    const [address, setAddress] = useState(initialState)
    const [edit, setEdit] = useState(false)
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState('')

    // Mutation
    const { mutate, isLoading, reset } = useMutation(data => {
        return axios.put('/api/users/profile', data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            updateUser({ type: "UPDATE", payload: data.data.userData })
            setSuccess(data.data.message)
            setMessage("")
            setEdit(false)
            reset()
        },
        onError: (error) => {
            setMessage(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    const editHandler = () => {
        setMessage("")
        setSuccess("")
        setEdit(true)
        setAddress(initialState)
    }
    const cancelHandler = () => {
        setEdit(false)
    }

    const deleteHandler = () => {
        mutate({ delete: "ADDRESS" })
    }

    const saveHandler = (e) => {
        e.preventDefault()
        mutate({ address })
    }

    if (isLoading) return <Loader />
    else return (
        <>
            {success && <Message variant='success'>{success}</Message>}
            {message && <Message variant='danger'>{message}</Message>}
            {edit ?
                <Form className="my-3" onSubmit={saveHandler}>
                    <Form.Group controlId='company'>
                        <Form.Control type='text' placeholder='Company (Optional)' value={address.company}
                            onChange={(e) => setAddress({ ...address, company: e.target.value })}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='address1'>
                        <Form.Control type='text' placeholder='Address' value={address.address1} required
                            onChange={(e) => setAddress({ ...address, address1: e.target.value })}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='address2'>
                        <Form.Control type='text' placeholder='Apartment, Suite, Etc. (Optional)' value={address.address2}
                            onChange={(e) => setAddress({ ...address, address2: e.target.value })}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='city'>
                        <Form.Control type='text' placeholder='City' value={address.city} required
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}>
                        </Form.Control>
                    </Form.Group>
                    <Row>
                        <Col className="pr-1">
                            <Form.Group controlId='country'>
                                <Form.Control type='text' placeholder='Country/Region' value={address.country} required
                                    onChange={(e) => setAddress({ ...address, country: e.target.value })}>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col className="px-1">
                            <Form.Group controlId='region'>
                                <Form.Control type='text' placeholder='State' value={address.region} required
                                    onChange={(e) => setAddress({ ...address, region: e.target.value })}>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col className="pl-1">
                            <Form.Group controlId='postalCode'>
                                <Form.Control type='text' placeholder='Postal code' value={address.postalCode} required
                                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId='phone'>
                        <Form.Control type='tel' placeholder='Phone' value={address.phone} required
                            onChange={(e) => setAddress({ ...address, phone: e.target.value })}>
                        </Form.Control>
                    </Form.Group>

                    <Button variant='secondary' className="text-danger p-0" type="submit">
                        Save
                    </Button>
                    <Button variant='secondary' className="p-0 ml-5" type="button"
                        onClick={cancelHandler}>
                        Cancel
                    </Button>
                </Form>
                :
                <>
                    {user.address
                        ? <>
                            {user.address.company && <p className="mt-3 mb-3">{user.address.company}</p>}
                            <p className="mt-3 mb-3">{user.address.address1} {user.address.address2}</p>
                            <p className="mt-3 mb-3">{user.address.city}, {user.address.region} {user.address.postalCode}</p>
                            <p className="mt-3 mb-3">{user.address.country}</p>
                            <p className="mt-3 mb-3">{user.address.phone} {user.address.address2}</p>
                        </>
                        : <p className="mt-3 mb-3">No Address Yet</p>
                    }
                    <Button variant='secondary' className="text-danger p-0"
                        onClick={editHandler}>
                        Edit
                    </Button>
                    {user.address && <Button variant='secondary' className="p-0 ml-5"
                        onClick={deleteHandler}>
                        Delete
                    </Button>}
                </>
            }
        </>
    )
}

export default EditAddress

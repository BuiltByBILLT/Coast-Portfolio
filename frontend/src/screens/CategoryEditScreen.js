import axios from 'axios'
import { modelNames } from 'mongoose'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const CategoryEditScreen = ({ match }) => {

    // States and Contexts
    const ID = match.params.id
    const user = useContext(UserContext)

    const [sectionID, setSectionID] = useState(ID)
    const [sectionName, setSectionName] = useState("")
    const [sectionWorkingName, setSectionWorkingName] = useState("")
    const [topSection, setTopSection] = useState("")
    const [sectionImage, setSectionImage] = useState("")
    const [sectionDisabled, setSectionDisabled] = useState(true)

    const [edit, setEdit] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // Query: Get Details
    const { isLoading: queryLoading, error: queryError, refetch } = useQuery([`categoryEdit`, ID], () => {
        return axios.get(`/api/categories/edit/${ID}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSectionName(data.data.sectionName)
            setSectionWorkingName(data.data.sectionWorkingName)
            setTopSection(data.data.topSection)
            setSectionID(data.data.sectionID)
            setSectionImage(data.data.sectionImage)
            setSectionDisabled(data.data.sectionDisabled)
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Mutation: Update Category 
    const { mutate, isLoading: mutationLoading, reset } = useMutation(data => {
        return axios.put(`/api/categories/edit/${ID}`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess("Category Update Success")
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
        mutate({ sectionName, sectionID, topSection, sectionWorkingName, sectionImage, sectionDisabled })
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
                            <Link to="/admin/categorylist">{"<-- Category List"}</Link>
                        </Col>
                        <Col className="text-right">
                            <Link to={`/category/${ID}`}>{"Go to Category -->"}</Link>
                        </Col>
                    </Row>
                    <h2 className="mt-3">Edit Category</h2>
                    {queryLoading ? <Loader />
                        : mutationLoading ? <Loader /> : (
                            <Form className="my-5" onSubmit={saveHandler}>
                                {error && <Message variant="danger">{error}</Message>}
                                {success && <Message variant="success">{success}</Message>}
                                <Form.Group controlId='SectionID'>
                                    <Form.Label>Category ID</Form.Label>
                                    <Form.Control type='number' placeholder='Category ID' value={sectionID} required disabled={true}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Name'>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type='text' placeholder='Name' value={sectionName} required disabled={!edit}
                                        onChange={(e) => setSectionName(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Internal Name'>
                                    <Form.Label>Internal Name</Form.Label>
                                    <Form.Control type='text' placeholder='Internal Name' value={sectionWorkingName} required disabled={!edit}
                                        onChange={(e) => setSectionWorkingName(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='ParentID'>
                                    <Form.Label>Parent ID</Form.Label>
                                    <Form.Control type='number' placeholder='Parent ID' value={topSection} required disabled={!edit}
                                        onChange={(e) => setTopSection(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='Image'>
                                    <Form.Label>Image</Form.Label>
                                    <Form.Control type='text' placeholder='Image URL' value={sectionImage} disabled={!edit}
                                        onChange={(e) => setSectionImage(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Check label="Display Category" disabled={!edit}
                                    type="checkbox" id="disabledCheck" className="mb-3" custom
                                    checked={!sectionDisabled}
                                    onChange={(e) => setSectionDisabled(!e.target.checked)}>
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

export default CategoryEditScreen

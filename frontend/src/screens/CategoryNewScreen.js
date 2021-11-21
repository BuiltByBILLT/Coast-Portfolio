import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const CategoryNewScreen = ({ history }) => {

    // States and Contexts
    const user = useContext(UserContext)

    const [sectionID, setSectionID] = useState("")
    const [sectionName, setSectionName] = useState("")
    const [sectionWorkingName, setSectionWorkingName] = useState("")
    const [topSection, setTopSection] = useState("")
    const [sectionImage, setSectionImage] = useState("")
    const [sectionDisabled, setSectionDisabled] = useState(false)

    const [available, setAvailable] = useState(true)
    const [edit, setEdit] = useState(true)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // Query: All Categories  
    const { isLoading: queryLoading, data: queryData } = useQuery("categoryListAdmin", () => {
        return axios.get(`/api/categories`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Mutation: New Category
    const { mutate, isLoading: mutationLoading, reset } = useMutation(data => {
        return axios.post(`/api/categories/edit/${sectionID}`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess("Category Creation Success!")
            setError("")
            setEdit(false)
            reset()
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Effect: Check if Category ID is already Taken
    useEffect(() => {
        if (queryData && queryData.data) {
            const match = queryData.data.filter(category => category.sectionID == sectionID)
            if (match.length) setAvailable(false)
            else setAvailable(true)
        }
        if (sectionID == "") setAvailable(true)
    }, [sectionID, queryData])

    // Handlers
    const saveHandler = (e) => {
        e.preventDefault()
        mutate({ sectionName, sectionID, topSection, sectionWorkingName, sectionImage, sectionDisabled })
    }
    const cancelHandler = (e) => {
        e.preventDefault()
        history.push('/admin/categorylist')
    }

    return (
        <Container className="my-5 pb-5">
            <Row>
                <Col xs={8}>
                    <Row>
                        <Col>
                            <Link to="/admin/categorylist">{"<-- Category List"}</Link>
                        </Col>
                    </Row>
                    <h2 className="mt-3">New Category</h2>
                    {queryLoading ? <Loader />
                        : mutationLoading ? <Loader /> : (
                            <Form className="my-5" onSubmit={saveHandler}>
                                {error && <Message variant="danger">{error}</Message>}
                                {success && <Message variant="success">{success}</Message>}
                                <Form.Group controlId='SectionID'>
                                    <Form.Label>Category ID</Form.Label>
                                    <Form.Control type='number' placeholder='Category ID' value={sectionID} required disabled={!edit}
                                        isInvalid={!available}
                                        onChange={(e) => setSectionID(e.target.value)}>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {sectionID} is already in use
                                    </Form.Control.Feedback>
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
                                <Form.Check type="checkbox" id="disabledCheck" className="mb-3" custom
                                    label="Disable Category" disabled={!edit}
                                    checked={sectionDisabled}
                                    onChange={(e) => setSectionDisabled(e.target.checked)}>
                                </Form.Check>
                                {edit && (
                                    <>
                                        <Button variant='secondary' className="text-danger p-0" type="submit" disabled={!available}>
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

export default CategoryNewScreen

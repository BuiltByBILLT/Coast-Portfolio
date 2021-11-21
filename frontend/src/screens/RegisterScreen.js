import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useMutation } from 'react-query'
import { UserContext, UserContextUpdate, } from '../contexts/UserContext'
import axios from 'axios'

const RegisterScreen = ({ location, history }) => {

    // States and Contexts
    const user = useContext(UserContext)
    const updateUser = useContext(UserContextUpdate)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const redirect = location.search ? location.search.split('=')[1] : '/'

    // Effect: Redirect if Already Logged In
    useEffect(() => {
        if (user._id) history.push('/profile')
    }, [user])


    // Mutation
    const { mutate, isLoading, reset } = useMutation(data => {
        return axios.post('/api/users/register', data)
    }, {
        onSuccess: (data) => {
            updateUser({ type: "LOGIN", payload: data.data })
            setMessage("")
            reset()
        },
        onError: (error) => {
            setMessage(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Handlers
    const submitHandler = (e) => {
        e.preventDefault()
        setMessage("")
        if (password == confirmPassword) {
            mutate({ firstName, lastName, email, password })
        } else { // Passwords not match
            setMessage("Passwords Do Not Match")
        }
        setPassword("")
        setConfirmPassword("")
    }


    return (
        <Container className="my-5 pt-3">
            <Row className='justify-content-lg-center'>
                <Col lg={7} xl={6}>
                    <h2 className="text-center text-danger mb-5 pb-3">Sign Up</h2>
                    {message && <Message variant='danger'>{message}</Message>}
                    {isLoading ? <Loader />
                        : <>
                            <Form onSubmit={submitHandler}>
                                <Form.Row>
                                    <Col>
                                        <Form.Group controlId='firstName'>
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control type='name' placeholder='Enter first name' value={firstName} required
                                                onChange={(e) => setFirstName(e.target.value)}>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId='lastName'>
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control type='name' placeholder='Enter last name' value={lastName} required
                                                onChange={(e) => setLastName(e.target.value)}>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Form.Row>
                                <Form.Group controlId='email'>
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control type='email' placeholder='Enter email' value={email} required
                                        onChange={(e) => setEmail(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='password'>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type='password' placeholder='Enter password' value={password} required
                                        onChange={(e) => setPassword(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='confirmPassword'>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type='password' placeholder='Confirm Password' value={confirmPassword} required
                                        onChange={(e) => setConfirmPassword(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Col xs={8} className="mx-auto my-4">
                                    <Button type='submit' variant='primary' block>
                                        Sign Up
                                    </Button>
                                </Col>
                            </Form>
                            <Row>
                                <Col className="text-center">
                                    Have an Account?
                                    <Link className="mx-2" to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                                        Login
                                    </Link>
                                </Col>
                            </Row>
                        </>
                    }
                </Col>
            </Row>

        </Container>
    )
}

export default RegisterScreen

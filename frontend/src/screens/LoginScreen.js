import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { UserContext, UserContextUpdate } from '../contexts/UserContext'
import { useMutation } from 'react-query'
import axios from 'axios'

const LoginScreen = ({ location, history }) => {

    const user = useContext(UserContext)
    const updateUser = useContext(UserContextUpdate)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // If User Already Logged in
    const redirect = location.search ? location.search.split('=')[1] : '/'
    useEffect(() => {
        if (user._id) history.push(redirect)
    }, [user])

    // Login Mutation
    const { mutate, isError, isLoading, error, reset } = useMutation(data => {
        return axios.post('/api/users/login', data)
    }, {
        onSuccess: (data) => {
            updateUser({ type: "LOGIN", payload: data.data })
            reset()
        }
    })

    const submitHandler = (e) => {
        e.preventDefault()
        mutate({ email, password })
    }

    return (
        <Container className="my-5 py-3">
            <Row className='justify-content-lg-center'>
                <Col lg={7} xl={6}>
                    <h2 className="text-center text-danger mb-5 pb-3">Log In</h2>
                    {isError &&
                        <Message variant='danger'>
                            {error.response && error.response.data.message
                                ? error.response.data.message : error.message}
                        </Message>
                    }
                    {isLoading ? <Loader />
                        : <Form onSubmit={submitHandler}>
                            <Form.Group controlId='email'>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type='email' placeholder='Enter email' value={email}
                                    onChange={(e) => setEmail(e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='password'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' placeholder='Enter password' value={password}
                                    onChange={(e) => setPassword(e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <div className="text-center">
                                <Button type='submit' variant='primary' className="mx-auto my-4" block
                                    style={{ maxWidth: "300px" }}>
                                    Log In
                                </Button>
                            </div>
                            <div className="text-center">
                                Not a member yet?
                                <Link className="mx-2 " to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                                    Sign Up
                                </Link>
                            </div>
                        </Form>
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default LoginScreen

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

const RegisterScreen = ({ location, history }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    const userRegister = useSelector(state => state.userRegister)
    const { loading, error, userInfo } = userRegister

    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
        }
        return () => { }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            dispatch(register(name, email, password))
        }
    }

    return (
        <Container className="my-5 pt-3">
            <h2 className="text-center text-danger mb-5 pb-3">Sign Up</h2>
            <FormContainer>
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='name' placeholder='Enter name' value={name} required
                            onChange={(e) => setName(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
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
            </FormContainer>
        </Container>
    )
}

export default RegisterScreen

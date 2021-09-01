import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'

const LoginScreen = ({ location, history }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { loading, error, userInfo } = userLogin

    const redirect = location.search ? location.search.split('=')[1] : '/profile'

    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
            // history.push('/profile')
        }
        return () => { }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <Container className="my-5 pt-3">
            <h2 className="text-center text-danger mb-5 pb-3">Log In</h2>
            <FormContainer>
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
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
                    <Col xs={8} className="mx-auto my-4">
                        <Button type='submit' variant='primary' block>
                            Log In
                        </Button>
                    </Col>
                </Form>
                <Row>
                    <Col className="text-center">
                        Not a member yet?
                        <Link className="mx-2" to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                            Sign Up
                        </Link>
                    </Col>
                </Row>
            </FormContainer>
        </Container>
    )
}

export default LoginScreen

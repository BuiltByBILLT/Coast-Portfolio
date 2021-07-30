import React, { useState, useEffect } from 'react'
import { Table, Form, Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import ProfileNav from '../components/ProfileNav'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

const ProfileInfoScreen = ({ location, history }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [nameEdit, setNameEdit] = useState(false)
    const [emailEdit, setEmailEdit] = useState(false)
    const [addressEdit, setAddressEdit] = useState(false)
    const [passwordEdit, setPasswordEdit] = useState(false)
    const [message, setMessage] = useState('')
    const [successMessage, setSucessMessage] = useState(false)

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const dispatch = useDispatch()
    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            if (!user.name) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetails('profile'))
            } else if (success) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetails('profile'))
                successPopup()
            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }
        return () => { }
    }, [dispatch, history, userInfo, user, success])

    const nameHandler = (e) => {
        e.preventDefault()
        setNameEdit(!nameEdit)
        if (nameEdit) {
            console.log("sent: " + name)
            dispatch(updateUserProfile({ name }))
        }
    }
    const emailHandler = (e) => {
        e.preventDefault()
        setEmailEdit(!emailEdit)
        if (emailEdit) {
            console.log("sent: " + email)
            dispatch(updateUserProfile({ email }))
        }
    }
    const addressHandler = (e) => {
        e.preventDefault()
        setAddressEdit(!addressEdit)
        if (emailEdit) {
            console.log("sent: " + address)
            // dispatch(updateUserProfile({ address }))
        }
    }
    const passwordHandler = (e) => {
        console.log(passwordEdit)
        e.preventDefault()
        let passEl = document.getElementById("password")
        let confirmEl = document.getElementById("confirmPassword")

        if (passwordEdit) {
            if (password !== confirmPassword) {
                setMessage('Passwords do not match')
                passEl.focus()
            } else if (password === "") {
                setMessage('Please Enter Password')
                passEl.focus()
            } else {
                console.log({ password })
                setMessage('')
                passEl.placeholder = "******"
                confirmEl.parentElement.className = "d-none form-group"
                setPasswordEdit(false)
                dispatch(updateUserProfile({ password }))
            }
        } else {
            passEl.placeholder = ""
            passEl.focus()
            confirmEl.parentElement.className = "form-group"
            setPasswordEdit(true)
        }
    }

    const successPopup = async () => {
        setSucessMessage(true)
        await new Promise(r => setTimeout(r, 5000));
        setSucessMessage(false)
    }

    return (
        <>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {successMessage && <Message variant='success'>Profile Updated</Message>}
            {loading && <Loader />}
            <Form>
                <Row>
                    <Col lg={6} className="p-5">
                        <Form.Group controlId='name'>
                            <Form.Label as="h3">Name</Form.Label>
                            <Form.Control type='name' placeholder='Enter name' value={name}
                                readOnly={!nameEdit} plaintext={!nameEdit}
                                onChange={(e) => setName(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Button variant='secondary' className="text-danger p-0"
                            onClick={nameHandler}>
                            {nameEdit ? "Save" : "Edit"}
                        </Button>
                    </Col>

                    <Col lg={6} className="p-5">
                        <Form.Group controlId='email'>
                            <Form.Label as="h3">Email</Form.Label>
                            <Form.Control type='email' placeholder='Enter email' value={email}
                                readOnly={!emailEdit} plaintext={!emailEdit}
                                onChange={(e) => setEmail(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Button variant='secondary' className="text-danger p-0"
                            onClick={emailHandler}>
                            {emailEdit ? "Save" : "Edit"}
                        </Button>
                    </Col>

                    <Col lg={6} className="p-5">
                        <Form.Group controlId='password'>
                            <Form.Label as="h3">Password</Form.Label>
                            <Form.Control type='password' placeholder='******'
                                readOnly={!passwordEdit} plaintext={!passwordEdit}
                                onChange={(e) => setPassword(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='confirmPassword' className="d-none">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type='password' placeholder='Confirm Password' value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Button id="passwordBtn" variant='secondary' className="text-danger p-0"
                            onClick={passwordHandler}>
                            {passwordEdit ? "Save" : "Edit"}
                        </Button>
                    </Col>

                    <Col lg={6} className="p-5">
                        <Form.Group controlId='address'>
                            <Form.Label as="h3">Address</Form.Label>
                            <Form.Control type='text' placeholder='Enter Address' value={address}
                                readOnly={!addressEdit} plaintext={!addressEdit}
                                onChange={(e) => setAddress(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Button variant='secondary' className="text-danger p-0"
                            onClick={addressHandler}>
                            {addressEdit ? "Save" : "Edit"}
                        </Button>
                    </Col>
                </Row>

            </Form>
        </>
    )
}

export default ProfileInfoScreen

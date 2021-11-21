import React, { useState, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { useMutation } from 'react-query'
import axios from 'axios'

import { Form, Button } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'

const EditPassword = () => {

    const user = useContext(UserContext)

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

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
        setPassword("")
        setMessage("")
        setSuccess("")
        setConfirmPassword("")
        setEdit(true)
    }

    const passwordHandler = (e) => {
        e.preventDefault()
        if (password == confirmPassword) {
            mutate({ password })
        } else { // Passwords not match
            setMessage("Passwords Do Not Match")
        }
        setPassword("")
        setConfirmPassword("")
    }

    if (isLoading) return <Loader />
    else return (
        <>
            {success && <Message variant='success'>{success}</Message>}
            {message && <Message variant='danger'>{message}</Message>}
            {edit ?
                <Form className="my-3" onSubmit={passwordHandler}>
                    <Form.Group controlId='password'>
                        <Form.Control type='password' placeholder='New Password' required value={password}
                            onChange={(e) => setPassword(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='confirmPassword'>
                        <Form.Control type='password' placeholder='Confirm Password' value={confirmPassword} required
                            onChange={(e) => setConfirmPassword(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Button id="passwordBtn" variant='secondary' className="text-danger p-0" type="submit">
                        Save
                    </Button>
                    <Button id="passwordBtn" variant='secondary' className="p-0 ml-5" type="button"
                        onClick={() => setEdit(false)}>
                        Cancel
                    </Button>
                </Form>
                :
                <>
                    <p className="mt-3 mb-3">*********</p>
                    <Button id="passwordBtn" variant='secondary' className="text-danger p-0"
                        onClick={editHandler}>
                        Edit
                    </Button>
                </>}
        </>
    )
}

export default EditPassword

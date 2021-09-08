import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserEditScreen = ({ match, history }) => {
    const userId = match.params.id
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isStaff, setIsStaff] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdate = useSelector(state => state.userUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET })
            history.push('/admin/userlist')
        } else {
            if (userInfo && userInfo.isStaff) {
                if (!user.name || user._id !== userId) {
                    dispatch(getUserDetails(userId))
                } else {
                    setName(user.name)
                    setEmail(user.email)
                    setIsStaff(user.isStaff)
                    setIsAdmin(user.isAdmin)
                }
            } else {
                history.push('/login')
            }
        }
        return () => { }
    }, [user, userId, dispatch, successUpdate, history])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ _id: userId, name, email, isAdmin, isStaff }))
    }

    return (
        <>
            <Link to='/admin/userlist' className='btn btn-light my-3'> Go Back</Link>
            <FormContainer>
                <h1>Edit User</h1>
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loadingUpdate && <Loader />}
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
                    {userInfo && userInfo.isAdmin &&
                        (<>
                            <Form.Group controlId='isStaff'>
                                <Form.Check type='checkbox' label='Is Staff' checked={isStaff}
                                    onChange={(e) => setIsStaff(e.target.checked)}>
                                </Form.Check>
                            </Form.Group>
                            <Form.Group controlId='isAdmin'>
                                <Form.Check type='checkbox' label='Is Admin' checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}>
                                </Form.Check>
                            </Form.Group>
                        </>)
                    }
                    <Button type='submit' variant='primary'>
                        Update
                    </Button>
                </Form>

            </FormContainer>
        </>
    )
}

export default UserEditScreen

import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Container, Form, InputGroup, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listUsers, deleteUser } from '../actions/userActions'

const UserListScreen = ({ history }) => {

    const [search, setSearch] = useState("")

    const dispatch = useDispatch()

    const userList = useSelector(state => state.userList)
    const { loading, error, users } = userList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete

    useEffect(() => {
        if (userInfo && userInfo.isStaff) {
            dispatch(listUsers())
        } else {
            history.push('/login')
        }
        return () => { }
    }, [dispatch, history, successDelete, userInfo])

    const deleteHandler = (id, name) => {
        if (window.confirm(`Delete ${name} \nAre you sure?`))
            dispatch(deleteUser(id))
    }
    const searchHandler = (e) => {
        e.preventDefault()
        alert(search)
        // dispatch()
    }
    return (
        <Container className="my-5 py-3">
            <Row>
                <Col>
                    <h1>Users</h1>
                </Col>
                <Col className="my-auto mr-4">
                    <Form onSubmit={searchHandler}>
                        <InputGroup>
                            <Form.Control
                                placeholder="Search by Name or Email"
                                aria-label="Search by Name or Email"
                                style={{ height: "50px" }}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <InputGroup.Append>
                                <Button variant="primary" onClick={searchHandler}>
                                    <i className="fas fa-search"></i>
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                : (
                    <Table striped borded hover responsive className='table-sm mt-3'>
                        <thead>
                            <tr>
                                <th>CREATED</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>STAFF</th>
                                <th>ADMIN</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.createdAt.slice(0, 10)}</td>
                                    <td>{user.name}</td>
                                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                    <td>{user.isStaff
                                        ? (<i className='fas fa-check' style={{ color: 'green' }}></i>)
                                        : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}
                                    </td>
                                    <td>{user.isAdmin
                                        ? (<i className='fas fa-check' style={{ color: 'green' }}></i>)
                                        : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}
                                    </td>
                                    <td>
                                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                            <Button variant='light' className=''>
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                        </LinkContainer>
                                        <Button variant='danger' className=''
                                            onClick={() => deleteHandler(user._id, user.name)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
        </Container>
    )
}

export default UserListScreen

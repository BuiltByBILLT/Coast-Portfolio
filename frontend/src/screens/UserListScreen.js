import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { toUSD } from '../common'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { UserContext } from '../contexts/UserContext'

const UserListScreen = ({ history }) => {

    // States and Contexts
    const user = useContext(UserContext)
    const [search, setSearch] = useState("")
    const [filtered, setFiltered] = useState([])
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    // List Query
    const { isLoading: qLoading, data, refetch } = useQuery("userListAdmin", () => {
        return axios.get(`/api/users`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })
    const users = data && data.data

    // Delete Mutation
    // const { mutate, isLoading: mLoading, reset } = useMutation(userCode => {
    //     return axios.delete(`/api/users/edit/${userCode}`, {
    //         headers: { Authorization: `Bearer ${user.token}` }
    //     })
    // }, {
    //     onSuccess: (data) => {
    //         console.log(data.data)
    //         setSuccess(`Deleted User ${data.data.userCode} Successfully`)
    //         setError("")
    //         reset()
    //         refetch()
    //         window.scrollTo({ top: 0, behavior: "smooth" });
    //     },
    //     onError: (error) => {
    //         setError(error.response && error.response.data.message
    //             ? error.response.data.message : error.message)
    //     }
    // })

    // Filter Effect
    useEffect(() => {
        if (users && !search) setFiltered(users)
        if (users && search)
            setFiltered(users.filter(user =>
                user.firstName.toLowerCase().includes(search.toLowerCase())
                || user.lastName.toLowerCase().includes(search.toLowerCase())
                || user.email.toLowerCase().includes(search.toLowerCase())
            ))
    }, [users, search])

    // Handlers
    // const createHandler = () => {
    //     history.push('/admin/usernew')
    // }
    // const deleteHandler = (userCode) => {
    //     if (window.confirm(`Delete User: ${userCode} \nAre you sure?`)) mutate(userCode)
    // }


    return (
        <Container className="my-5 pt-3 pb-5">
            <Row className='align-items-center'>
                <Col className="my-auto">
                    <h2 className="my-0">Users</h2>
                </Col>
                <Col className="my-auto">
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <InputGroup>
                            <Form.Control placeholder="Search by Name or Email" aria-label="Search by Name or email"
                                style={{ height: "50px" }}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <InputGroup.Append>
                                <Button variant="primary">
                                    <i className="fas fa-search"></i>
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </Col>
                {/* <Col className="text-right" xs="auto">
                    <Button variant="danger" className='my-3' onClick={createHandler}>
                        <i className='fas fa-plus'></i> New User
                    </Button>
                </Col> */}
            </Row>
            {error && <Message variant="danger">{error}</Message>}
            {success && <Message variant="success">{success}</Message>}
            {qLoading ? <Loader /> : (
                <Table striped bordered hover responsive className='table-sm mt-3 mb-0'>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th></th>
                            <th>Email</th>
                            <th>Staff</th>
                            <th>Admin</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && filtered.map(user => (
                            <tr key={user._id}>
                                <td>{user.firstName + " " + user.lastName}</td>
                                <td>{""}</td>
                                <td>{user.email}</td>
                                <td>{
                                    user.isStaff
                                        ? <i className='fas fa-check text-success'></i>
                                        : <i className='fas fa-times text-danger'></i>
                                }</td>
                                <td>
                                    {user.isAdmin
                                        ? <i className='fas fa-check text-success'></i>
                                        : <i className='fas fa-times text-danger'></i>
                                    }
                                </td>
                                {/* <td className="p-0 align-middle text-center">
                                    <LinkContainer to={`/admin/user/${user.userCode}/edit`} className="my-auto">
                                        <Button variant='dark' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm ml-2'
                                        onClick={() => deleteHandler(user.userCode)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    )
}

export default UserListScreen

import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Container, Form, InputGroup } from 'react-bootstrap'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import { Link } from 'react-router-dom'

const InventoryListScreen = ({ history, match }) => {
    // const pageNumber = match.params.pageNumber || 1

    const [search, setSearch] = useState('')
    const { userInfo } = useSelector(state => state.userLogin)

    const { isLoading, isError, data, error } = useQuery('inventory', () =>
        axios.get(`/api/inventory`,
            { headers: { Authorization: `Bearer ${userInfo.token}` } }))
    const inventory = data && data.data.inventory
    const page = data && data.data.page
    const pages = data && data.data.pages

    // const { loading, error, products, page, pages } = useSelector(state => state.productList)
    // const productDelete = useSelector(state => state.productDelete)
    // const { loading: loadingDelete,
    //     error: errorDelete,
    //     success: successDelete
    // } = productDelete
    // const productCreate = useSelector(state => state.productCreate)
    // const { loading: loadingCreate,
    //     error: errorCreate,
    //     success: successCreate,
    //     product: createdProduct
    // } = productCreate

    const dispatch = useDispatch()
    useEffect(() => {
        if (userInfo && userInfo.isStaff) {
            // dispatch(listProducts('', pageNumber, 200, "updatedAt", -1, 1))
        } else {
            history.push('/login')
        }
        // return () => { dispatch({ type: PRODUCT_CREATE_RESET }) }
        // }, [successDelete])
    }, [])

    // useEffect(() => {
    //     if (successCreate) {
    //         history.push(`/admin/product/${createdProduct.cloverID}/edit`)
    //     }
    // }, [successCreate])


    const deleteHandler = (id, name) => {
        if (window.confirm(`Delete ${name} \nAre you sure?`)) {
            // dispatch(deleteProduct(id))
        }
    }
    const createProductHandler = () => {
        // dispatch(createProduct())
    }
    const searchHandler = (e) => {
        e.preventDefault()
        // dispatch(listProducts(search, pageNumber, 200, "updatedAt", -1, 1))
    }
    const sortHandler = (sort, upDown) => {
        // dispatch(listProducts(search, pageNumber, 200, sort, upDown, 1))
    }

    return (
        <Container className="my-5 py-3">
            {/* {JSON.stringify(inventory)} */}
            <Row className='align-items-center mb-4'>
                <Col>
                    <h1>Inventory</h1>
                </Col>
                <Col className="my-auto mr-4">
                    <Form onSubmit={searchHandler}>
                        <InputGroup>
                            <Form.Control
                                placeholder="Search by Name or SKU"
                                aria-label="Search by Name or SKU"
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
                <Col className="text-right" xs="auto">
                    <Button variant="danger" className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Create Inventory Item
                    </Button>
                </Col>
            </Row>
            {/* {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{error}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{error}</Message>} */}
            {isLoading ? <Loader /> : isError ? <Message variant='danger'>{error}</Message>
                : (<>
                    <Table striped bordered hover responsive className='table-sm mt-3'>
                        <thead>
                            <tr>
                                <th>{"MODIFIED "}
                                    <br />
                                    <i className='fas fa-sort-up' onClick={() => { sortHandler("updatedAt", 1) }}></i>
                                    /
                                    <i className='fas fa-sort-down' onClick={() => { sortHandler("updatedAt", -1) }}></i>
                                </th>
                                <th>{"Parent "}
                                    <br />
                                    <i className='fas fa-sort-up' onClick={() => { sortHandler("pID", 1) }}></i>
                                    /
                                    <i className='fas fa-sort-down' onClick={() => { sortHandler("pID", -1) }}></i>
                                </th>
                                <th>{"NAME "}
                                    <br />
                                    <i className='fas fa-sort-up' onClick={() => { sortHandler("pName", 1) }}></i>
                                    /
                                    <i className='fas fa-sort-down' onClick={() => { sortHandler("pName", -1) }}></i>
                                </th>
                                <th>{"Price "}
                                    <br />
                                    <i className='fas fa-sort-up' onClick={() => { sortHandler("pName", 1) }}></i>
                                    /
                                    <i className='fas fa-sort-down' onClick={() => { sortHandler("pName", -1) }}></i>
                                </th>
                                <th>{"Qty "}
                                    <br />
                                    <i className='fas fa-sort-up' onClick={() => { sortHandler("pName", 1) }}></i>
                                    /
                                    <i className='fas fa-sort-down' onClick={() => { sortHandler("pName", -1) }}></i>
                                </th>
                                {/* <th>{"PRICE "}
                                    <i className='fas fa-sort-up' onClick={() => { sortHandler("pPrice", -1) }}></i>
                                    /
                                    <i className='fas fa-sort-down' onClick={() => { sortHandler("pPrice", 1) }}></i>
                                </th>
                                <th>{"STOCK "}
                                    <i className='fas fa-sort-up' onClick={() => { sortHandler("pInStock", -1) }}></i>
                                    /
                                    <i className='fas fa-sort-down' onClick={() => { sortHandler("pInStock", 1) }}></i> */}
                                {/* </th> */}
                                <th>DISPLAY</th>
                                <th>SELL </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(inventory => (
                                <tr key={inventory.cloverID}>
                                    <td>{inventory.updatedAt.slice(0, 10)}</td>
                                    <td>{inventory.iParent}</td>
                                    <td><Link>{inventory.cloverName}</Link></td>
                                    <td>{Number(inventory.iPrice / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
                                    }</td>
                                    <td>{inventory.iStock}</td>
                                    <td >
                                        {inventory.iDisplay
                                            ? <i className='fas fa-check' style={{ color: 'green' }}></i>
                                            : <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        }
                                    </td>
                                    <td>
                                        {inventory.iSell
                                            ? <i className='fas fa-check' style={{ color: 'green' }}></i>
                                            : <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        }
                                    </td>
                                    {/* <td>{Number(inventory.pPrice / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td> */}
                                    {/* <td>{inventory.pInStock}</td> */}
                                    <td className="text-center px-1">
                                        {/* <LinkContainer to={`/inventory/${inventory.cloverID}`}>
                                            <Button variant='dark' className='btn-sm'>
                                                <i className="fas fa-link"></i>
                                            </Button>
                                        </LinkContainer> */}
                                        {/* <LinkContainer to={`/admin/inventory/${inventory.cloverID}/edit`}>
                                            <Button variant='dark' className='btn-sm mr-2'>
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                        </LinkContainer> */}
                                        <Button variant='danger' className='btn-sm'
                                            onClick={() => deleteHandler(inventory.cloverID, inventory.pName)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} isAdmin={true} />
                </>
                )
            }
        </Container >
    )
}

export default InventoryListScreen

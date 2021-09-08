import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Container, Form, InputGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

const ProductListScreen = ({ history, match }) => {
    const pageNumber = match.params.pageNumber || 1

    const [search, setSearch] = useState('')

    const { loading, error, products, page, pages } = useSelector(state => state.productList)
    const { userInfo } = useSelector(state => state.userLogin)
    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete,
        error: errorDelete,
        success: successDelete
    } = productDelete
    const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
        product: createdProduct
    } = productCreate

    const dispatch = useDispatch()
    useEffect(() => {
        if (userInfo && userInfo.isStaff) {
            dispatch(listProducts('', pageNumber, 200, "updatedAt", -1, 1))
        } else {
            history.push('/login')
        }
        return () => { dispatch({ type: PRODUCT_CREATE_RESET }) }
    }, [successDelete])

    useEffect(() => {
        if (successCreate) {
            history.push(`/admin/product/${createdProduct.cloverID}/edit`)
        }
    }, [successCreate])


    const deleteHandler = (id, name) => {
        if (window.confirm(`Delete ${name} \nAre you sure?`)) {
            dispatch(deleteProduct(id))
        }
    }
    const createProductHandler = () => {
        dispatch(createProduct())
    }
    const searchHandler = (e) => {
        e.preventDefault()
        dispatch(listProducts(search, pageNumber, 200, "updatedAt", -1, 1))
    }
    const sortHandler = (sort, upDown) => {
        dispatch(listProducts(search, pageNumber, 200, sort, upDown, 1))
    }

    return (
        <Container className="my-5 py-3">
            <Row className='align-items-center mb-4'>
                <Col>
                    <h1>Products</h1>
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
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{error}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{error}</Message>}
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                : (<>
                    <Table striped bordered hover responsive className='table-sm mt-3'>
                        <thead>
                            <tr>
                                <th>{"NAME "}
                                    <i className='fas fa-sort-up' onClick={() => { sortHandler("pName", 1) }}></i>
                                    /
                                    <i className='fas fa-sort-down' onClick={() => { sortHandler("pName", -1) }}></i>
                                </th>
                                <th>{"MODIFIED "}
                                    <i className='fas fa-sort-up' onClick={() => { sortHandler("updatedAt", 1) }}></i>
                                    /
                                    <i className='fas fa-sort-down' onClick={() => { sortHandler("updatedAt", -1) }}></i>
                                </th>
                                <th>{"PRICE "}
                                    <i className='fas fa-sort-up' onClick={() => { sortHandler("pPrice", -1) }}></i>
                                    /
                                    <i className='fas fa-sort-down' onClick={() => { sortHandler("pPrice", 1) }}></i>
                                </th>
                                <th>{"STOCK "}
                                    <i className='fas fa-sort-up' onClick={() => { sortHandler("pInStock", -1) }}></i>
                                    /
                                    <i className='fas fa-sort-down' onClick={() => { sortHandler("pInStock", 1) }}></i>
                                </th>
                                {/* <th>DISPLAY</th> */}
                                {/* <th>SELL</th> */}
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.cloverID}>
                                    <td>{product.pName}</td>
                                    <td>{product.updatedAt.slice(0, 10)}</td>
                                    <td>{Number(product.pPrice / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                                    <td>{product.pInStock}</td>
                                    <td className="text-center">
                                        <LinkContainer to={`/product/${product.cloverID}`}>
                                            <Button variant='dark' className='btn-sm'>
                                                <i className="fas fa-link"></i>
                                            </Button>
                                        </LinkContainer>
                                        <LinkContainer to={`/admin/product/${product.cloverID}/edit`}>
                                            <Button variant='light' className='btn-sm'>
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                        </LinkContainer>
                                        <Button variant='danger' className='btn-sm'
                                            onClick={() => deleteHandler(product.cloverID, product.pName)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} isAdmin={true} />
                </>
                )}
        </Container>
    )
}

export default ProductListScreen

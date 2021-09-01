import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = ({ match, history }) => {
    const productId = match.params.id
    const [edit, setEdit] = useState(false)
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [listPrice, setListPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')

    const [uploading, setUploading] = useState(false)
    const [success, setSuccess] = useState(false)

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        dispatch(listProductDetails(productId))

        return () => { dispatch({ type: PRODUCT_UPDATE_RESET }) }
    }, [])

    useEffect(() => {
        setSuccess(successUpdate)
    }, [successUpdate])

    useEffect(() => {
        setName(product.pName)
        setPrice(product.pPrice)
        setListPrice(product.pListPrice)
        // setImage(product.images && product.images[0].imageSrc)
        setBrand(product.pManufacturer)
        setCategory(product.pSection)
        setCountInStock(product.pInStock)
        setDescription(product.dLongDescription || product.pDescription)
    }, [product])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
            const { data } = await axios.post('/api/upload', formData, config)
            setImage(data)
            setUploading(false)
        } catch (error) {
            console.error(error)
            setUploading(false)
        }
    }

    const submitHandler = () => {
        // e.preventDefault()
        setEdit(false)
        window.scrollTo({ top: 0, behavior: "smooth" });
        dispatch(updateProduct({
            cloverID: product.cloverID,
            name,
            price,
            listPrice,
            brand,
            // image,
            category,
            description,
            countInStock
        }))
    }

    return (
        <Container className="my-5 py-3">
            <Link to='/admin/productlist' className='btn btn-light my-3'> Go Back</Link>
            <h1>Edit Product</h1>
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loadingUpdate && <Loader />}
            {success && <Message variant='success'>Update Sucessful</Message>}
            {loading && <Loader />}
            {error ? <Message variant='danger'>{error}</Message> :
                (
                    <>
                        <Form>
                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type='name' placeholder='Enter name' value={name} disabled={!edit}
                                    onChange={(e) => setName(e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='price'>
                                <Form.Label>Price (In Cents)</Form.Label>
                                <Form.Control type='number' placeholder='Enter price' value={price} disabled={!edit}
                                    onChange={(e) => setPrice(e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='listPrice'>
                                <Form.Label>Listed Price (In Cents)</Form.Label>
                                <Form.Control type='number' placeholder='Enter price' value={listPrice} disabled={!edit}
                                    onChange={(e) => setListPrice(e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control type='text' placeholder='Enter image URL' value={image} disabled={!edit}
                                    onChange={(e) => setImage(e.target.value)}>
                                </Form.Control>
                                <Form.File id='image-file' label='Choose File' custom
                                    onChange={uploadFileHandler}>
                                </Form.File>
                                {uploading && <Loader />}
                            </Form.Group>
                            <Form.Group controlId='brand'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control type='text' placeholder='Enter brand' value={brand} disabled={!edit}
                                    onChange={(e) => setBrand(e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='countInStock'>
                                <Form.Label>Count In Stock</Form.Label>
                                <Form.Control type='number' placeholder='Enter Count In Stock' value={countInStock} disabled={!edit}
                                    onChange={(e) => setCountInStock(e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='category'>
                                <Form.Label>Category</Form.Label>
                                <Form.Control type='text' placeholder='Enter category' value={category} disabled={!edit}
                                    onChange={(e) => setCategory(e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='description'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control as='textarea' placeholder='Enter description' value={description} disabled={!edit}
                                    onChange={(e) => setDescription(e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                        {edit
                            ? <Button variant='primary'
                                onClick={() => submitHandler()}>
                                Update
                            </Button>
                            : <Button variant='outline-danger'
                                onClick={() => {
                                    setEdit(!edit)
                                    setSuccess(false)
                                }}>
                                Edit
                            </Button>}
                    </>
                )}

        </Container>
    )
}

export default ProductEditScreen

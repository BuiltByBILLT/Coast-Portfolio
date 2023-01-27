import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Accordion, Card, Col, Container, Row, Button } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { toUSD } from '../common'
import { UserContext } from '../contexts/UserContext'
import useCategories from '../hooks/useCatergories'
import CloverMatcherSuggestions from './CloverMatcherSuggestions'
import ImageDisplay from './ImageDisplay'
import Message from './Message'
import ProductCrumbs from './ProductCrumbs'


const CloverMatcherSolo = ({ pIDParam, next }) => {

    const user = useContext(UserContext)
    const categories = useCategories()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [choice, setChoice] = useState("")
    const [product, setProduct] = useState({})
    const [pID, setPID] = useState(pIDParam)
    useEffect(() => { setPID(pIDParam) }, [pIDParam])

    const { pName, pPrice, pListPrice, pDescription, pLongDescription } = product

    // Query for Rand Clover Orphan
    const { isFetching } = useQuery(["Product", pID], () => {
        setProduct({})
        return axios.get(`/api/products/edit/${encodeURIComponent(pID)}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: ({ data }) => {
            setChoice("")
            setProduct(data)
            setSuccess("")
        },
        onError: ({ response, message }) => { setError(response?.data.message || message) },
    })

    // Mutate for Sumbit
    const { mutate, isLoading } = useMutation(() => {
        return axios.put(`/api/products/edit/${encodeURIComponent(pID)}`, {
            ...product, cloverID: choice
        }, { headers: { Authorization: `Bearer ${user.token}` } })
    }, {
        onSuccess: () => {
            setSuccess(`Success!`)
            next()
        },
        onError: ({ response, message }) => { setError(response?.data.message || message) },
    })

    // Skip
    const skipHandler = () => next()

    if (error) return <Container className="my-5 py-3"><Message variant='danger'>{error}</Message></Container>
    return (
        <Container className="mb-lg-5 py-3" style={{ backgroundColor: "#EEE" }}>
            <ProductCrumbs product={product} />
            <Row className="mb-5">
                <Col lg={4} className="pr-5">
                    {product.images && <ImageDisplay product={product} />}
                </Col>
                <Col lg={8}>
                    <div className="d-flex">
                        <div>
                            <h3><Link to={`/category/${product.pSection}`} className="text-danger" >
                                {categories?.find(cat => cat.sectionID == product.pSection)?.sectionName || "Category"}
                            </Link>
                            </h3>
                            <h4 className="mt-3 mb-1">Product ID: <Link to={`/admin/product/${pID}/edit`}>{pID}</Link></h4>
                            <h4 className="mt-1 mb-3">{pName || "name"}</h4>
                            <h3 className="text-danger">  {toUSD(pPrice)}
                                <span className="ml-4 text-muted" style={{ textDecoration: "line-through" }}>
                                    {pListPrice && toUSD(pListPrice)}
                                </span>
                            </h3>
                        </div>
                        <div className="pl-2 ml-auto">
                            <Button block className="mb-2" onClick={skipHandler}
                                disabled={isLoading || isFetching}>
                                Skip
                            </Button>
                            <Button block variant={success ? "success" : "danger"} disabled={!choice || isLoading || isFetching}
                                onClick={mutate}
                            >{success || 'Save'}</Button>
                        </div>
                    </div>

                    <CloverMatcherSuggestions queryProp={product.pName} choice={choice} setChoice={setChoice} disabled={isLoading || success || isFetching} />

                    <Accordion defaultActiveKey="">
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0" style={{ border: "none" }}>
                                <h4 className="">Description</h4>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    {pLongDescription
                                        ? <div dangerouslySetInnerHTML={{ __html: pLongDescription }} />
                                        : pDescription
                                            ? <div dangerouslySetInnerHTML={{ __html: pDescription }} />
                                            : "No Description"
                                    }
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Col>
            </Row>
        </Container>

    )
}

export default CloverMatcherSolo
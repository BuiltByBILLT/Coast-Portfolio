import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Accordion, Card, Col, Container, Row, Button } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { toUSD } from '../common'
import { UserContext } from '../contexts/UserContext'
import useCategories from '../hooks/useCatergories'
import useCloverSkus from '../hooks/useClover'
import CloverMatcherSuggestions from './CloverMatcherSuggestions'
import ImageDisplay from './ImageDisplay'
import Message from './Message'
import ProductCrumbs from './ProductCrumbs'


const CloverMatcherParent = ({ pIDParam, next }) => {

    const user = useContext(UserContext)
    const cloverSkus = useCloverSkus()
    const categories = useCategories()

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [choice, setChoice] = useState("")
    const [option, setOption] = useState({})
    const [optionIndex, setOptionIndex] = useState(0)
    const [missing, setMissing] = useState([])
    const [product, setProduct] = useState({})
    const [pID, setPID] = useState(pIDParam)
    useEffect(() => { setPID(pIDParam) }, [pIDParam])

    const { pName, pDescription, pLongDescription, options } = product
    useEffect(() => setOption(missing[optionIndex] || {}), [missing, optionIndex])

    // Query for Rand Clover Orphan
    const { refetch } = useQuery(["products", pID], () => {
        return axios.get(`/api/products/edit/${encodeURIComponent(pID)}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: ({ data }) => {
            setProduct(data)
            setMissing(data.options.filter(option => !option.cloverID))
            setSuccess("")
        },
        onError: ({ response, message }) => { setError(response?.data.message || message) },
    })

    // Mutate for Sumbit
    const { mutate, isLoading } = useMutation(() => {
        let _options = [...product.options]
        let index = _options.findIndex(opt => opt.oName == option.oName)
        _options[index].cloverID = choice
        let _product = { ...product, options: [..._options] }
        return axios.put(`/api/products/edit/${encodeURIComponent(pID)}`, _product,
            { headers: { Authorization: `Bearer ${user.token}` } }
        )
    }, {
        onSuccess: () => {
            setSuccess(`Success!`)
            nextHandler()
            refetch()
        },
        onError: ({ response, message }) => { setError(response?.data.message || message) },
    })

    // Skip
    const skipHandler = () => {
        setOptionIndex(optionIndex + 1)
        nextHandler()
    }

    const nextHandler = () => {
        setChoice("")
        if (optionIndex == missing.length - 1) {
            setProduct({})
            setOption({})
            next()
            setOptionIndex(0)
        }
    }


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
                            <h3 style={{ backgroundColor: "#FFF" }}>
                                <span className="mr-2">{option.oName}</span>
                                <span className="text-danger mr-2">{toUSD(option.oPrice)}</span>
                            </h3>
                        </div>
                        <div className="pl-2 ml-auto">
                            <Button block className="mb-2" onClick={skipHandler}>Skip</Button>
                            <Button block variant={success ? "success" : "danger"} disabled={!choice || isLoading}
                                onClick={mutate}
                            >{success || 'Save'}</Button>
                        </div>
                    </div>

                    <div className="mb-2" style={{ backgroundColor: "#DDD" }}>
                        Other Options:
                        {options && options.filter(opt => opt.oName != option.oName).map(opt => (
                            <div key={opt.oName}>
                                <span className="mr-2">{opt.oName}</span>
                                <span className="text-muted mr-2">{toUSD(opt.oPrice)}</span>
                                <span className="text-danger">
                                    {cloverSkus?.find(clover => clover.cloverID == opt.cloverID)?.cloverSku || "missing"}
                                </span>
                            </div>
                        ))}
                    </div>

                    <CloverMatcherSuggestions queryProp={product.pName} choice={choice} setChoice={setChoice} disabled={isLoading || success} />

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

export default CloverMatcherParent
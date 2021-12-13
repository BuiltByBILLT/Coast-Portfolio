import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Card, Form, ListGroup } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'

const BrandFilter = ({ keyword, brands: selectedBrands, pageNumber: page }) => {

    const { isLoading, data, refetch } = useQuery('brandList', () => {
        return axios.get(`/api/brands`)
    })
    const brands = data && data.data

    const [filter, setFilter] = useState([])

    const history = useHistory()

    const addBrand = (e) => {
        setFilter(arr => {
            if (filter.includes(e)) return arr
            else return [...arr, e]
        })
    }
    const removeBrand = (e) => {
        setFilter(arr => arr.filter(el => el != e))
    }


    const filterHandler = (e) => {
        history.push("/search/" + keyword + "/page/" + 1 + "/brands/" + filter.join('_'))
    }


    return (
        <Card>
            <Card.Header as="h5">Filter by Brand</Card.Header>
            <ListGroup variant="flush" className="my-2 border-0">
                {brands && brands.map((brand) => (
                    <ListGroup.Item key={brand.brandID} className="py-1 border-0">
                        <Form.Check type="checkbox" value={brand.brandID} label={brand.brandName}
                            onChange={(e) => e.target.checked ? addBrand(e.target.value) : removeBrand(e.target.value)}
                        ></Form.Check>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Button variant="danger" onClick={filterHandler}>
                Filter
            </Button>
        </Card>
    )
}

export default BrandFilter

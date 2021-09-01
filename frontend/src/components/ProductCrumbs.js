import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Breadcrumb } from 'react-bootstrap'
import { getCategoryDetails } from '../actions/categoryActions'

const Breadcrumbs = ({ product }) => {

    const { category } = useSelector(state => state.categoryDetails)

    const dispatch = useDispatch()
    useEffect(() => {
        if (product) {
            dispatch(getCategoryDetails(product.pSection))
        }
    }, [dispatch, product])

    return (
        <>
            {
                category && category.breadcrumbs && category.breadcrumbs[0] && (
                    <Breadcrumb className="mb-4">
                        <LinkContainer to="/">
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                        </LinkContainer>
                        {category.breadcrumbs.slice().reverse().map(crumb => (
                            <LinkContainer key={crumb.sectionID} to={`/category/${crumb.sectionID}`}>
                                <Breadcrumb.Item>{crumb.sectionName}</Breadcrumb.Item>
                            </LinkContainer>
                        ))}
                        {
                            <Breadcrumb.Item active className="text-danger">
                                {product.pName}
                            </Breadcrumb.Item>
                        }
                    </Breadcrumb>
                )
            }
        </>
    )
}

export default Breadcrumbs

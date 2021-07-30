import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Breadcrumb } from 'react-bootstrap'
import { getCategoryDetails } from '../actions/categoryActions'

const BreadCrumbs = ({ category }) => {

    return (
        <>
            {
                category && category.breadcrumbs && category.breadcrumbs[0] && (
                    <Breadcrumb className="mt-5">
                        <LinkContainer to="/">
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                        </LinkContainer>
                        {category.breadcrumbs.slice(1).reverse().map(crumb => (
                            <LinkContainer key={crumb.sectionID} to={`/category/${crumb.sectionID}`}>
                                <Breadcrumb.Item>{crumb.sectionName}</Breadcrumb.Item>
                            </LinkContainer>
                        ))}
                        {
                            category.breadcrumbs[0] &&
                            <Breadcrumb.Item active className="text-danger">
                                {category.breadcrumbs[0].sectionName}
                            </Breadcrumb.Item>
                        }
                    </Breadcrumb>
                )
            }
        </>
    )
}

export default BreadCrumbs

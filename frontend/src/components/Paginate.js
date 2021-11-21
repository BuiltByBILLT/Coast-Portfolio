import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
    return (pages > 1 && (
        <Pagination className="">
            <Pagination.Item to="" disabled={page == 1}>&laquo;</Pagination.Item>
            <Pagination.Item to="" disabled>{page}</Pagination.Item>
            <Pagination.Item to="" disabled >of</Pagination.Item>
            <Pagination.Item to="" disabled>{pages}</Pagination.Item>
            <Pagination.Item to="" >&raquo;</Pagination.Item>
        </Pagination>
    ))
}

export default Paginate

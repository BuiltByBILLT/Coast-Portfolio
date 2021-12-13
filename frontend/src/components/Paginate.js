import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useHistory } from 'react-router-dom'

const Paginate = ({ pages, page, keyword, location, brands }) => {

    const history = useHistory()
    const nextHandler = () => {
        history.push(location + "/" + keyword + "/page/" + (Number(page) + 1) + "/brands/" + brands)
    }
    const prevHandler = () => {
        history.push(location + "/" + keyword + "/page/" + (Number(page) - 1) + "/brands/" + brands)
    }

    return (pages > 1 && (
        <Pagination className="">
            <Pagination.Item to="" disabled={page == 1}
                onClick={prevHandler}
            >&laquo;</Pagination.Item>
            <Pagination.Item to="" disabled>{page}</Pagination.Item>
            <Pagination.Item to="" disabled >of</Pagination.Item>
            <Pagination.Item to="" disabled>{pages}</Pagination.Item>
            <Pagination.Item to=""
                onClick={nextHandler}
            >&raquo;</Pagination.Item>
        </Pagination>
    ))
}

export default Paginate

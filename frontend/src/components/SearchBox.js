import React, { useState } from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap'
import '../styles/SearchBox.css'

const SearchBox = ({ history }) => {
    const [keyword, setKeyword] = useState('')
    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            history.push(`/search/${keyword}`)
        } else {
            history.push('/search/')
        }
    }

    return (
        <Form onSubmit={submitHandler} inline>
            <InputGroup>
                <InputGroup.Prepend>
                    <Button type='submit' variant='' className='mr-1 ml-4 px-0'>
                        <i className="fas fa-search"></i>
                    </Button>
                </InputGroup.Prepend>
                <Form.Control type='text' name='q'
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder='Search...'
                    className='px-1 searchBoxInput'>
                </Form.Control>
            </InputGroup>
        </Form>
    )
}

export default SearchBox

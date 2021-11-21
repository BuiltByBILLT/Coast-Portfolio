import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loader = ({ height }) => {

    return (
        <Spinner

            animation='border'
            role='status'
            style={{
                width: '100px',
                height: height || '100px',
                margin: '100px auto',
                display: 'block',

            }}>
            <span className='sr-only'>Loading...</span>
        </Spinner>
    )
}

export default Loader

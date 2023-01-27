import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loader = ({ size }) => {

    return (
        <Spinner className="mx-auto"
            animation='border'
            role='status'
            style={{
                width: size || '100px',
                height: size || '100px',
                margin: `${size} auto` || '100px auto',
                display: 'block',

            }}>
            <span className='sr-only'>Loading...</span>
        </Spinner>
    )
}

export default Loader

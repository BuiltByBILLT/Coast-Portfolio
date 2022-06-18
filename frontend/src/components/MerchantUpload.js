import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { UserContext } from '../contexts/UserContext'
import { useMutation, useQuery } from 'react-query'


const MerchantUpload = () => {

    const [uploading, setUploading] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const [file, setFile] = useState("")
    const [merchants, setMerchants] = useState([])
    const [selected, setSelected] = useState(0)
    const [addNew, setAddNew] = useState('')

    const user = useContext(UserContext)

    const { refetch } = useQuery('merchants', () => {
        return axios.get(`/api/merchants`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            setMerchants(data.data)
        }
    })

    const { mutate, isLoading, reset } = useMutation(() => {
        setSuccess('')
        setError('')
        const formData = new FormData()
        formData.append('file', file)
        return axios.post(`/api/merchants/${addNew || selected}`, formData, {
            headers: {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess(data.data)
            setError('')
            reset()
            refetch()
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    useEffect(() => { setAddNew('') }, [selected])


    return (

        <Form className="my-4">
            <Form.Label>Merchant CSV:</Form.Label>
            <OverlayTrigger key='tooltip' placement='right' overlay={
                <Tooltip id='tooltip'>
                    Must be a CSV File with exactly 3 header columns "sku" "description" and "price" (all lowercase)
                </Tooltip>}>
                <span style={{ width: '20px' }}> <i className="fas fa-info-circle" ></i></span>
            </OverlayTrigger>
            <Form.Row>
                <Col xs="auto">
                    <Form.Control as="select" value={selected}
                        onChange={(e) => setSelected(e.target.value)}>
                        <option key={0} value={0}>Select Merchant</option>
                        <option key={1} value='NEW'>Add New Merchant</option>
                        {merchants.map((merchant) => (
                            <option key={merchant} value={merchant}>{merchant}</option>
                        ))}
                    </Form.Control>
                </Col>
                {selected === 'NEW' && <Col xs='auto'>
                    <Form.Control placeholder='New Merchant Name'
                        value={addNew} onChange={(e) => { setAddNew(e.target.value) }}
                    />
                </Col>}
                <Col xs="auto">
                    <Form.File
                        id="custom-file"
                        label={file ? file.name : "No File Selected"}
                        custom
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </Col>
                <Col xs="auto">
                    <Button type='button' style={{ height: '47px' }}
                        onClick={() => mutate()} disabled={selected === '0'}>
                        Upload
                    </Button>
                </Col>
            </Form.Row>
            {success && `Successfully uploaded: ${success}`}
            {error && `error: ${error}`}
        </Form >
    )
}

export default MerchantUpload
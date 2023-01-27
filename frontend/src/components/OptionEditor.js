import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useHistory } from 'react-router-dom'


const OptionEditor = ({ options, setOptions, edit }) => {
    const history = useHistory()
    if (!options) return null

    const setOptionsHandler = (index, prop, value) => {
        const _options = [...options]
        _options[index][prop] = value
        setOptions(_options)
    }
    const deleteOptionHandler = (index) => {
        const _options = [...options]
        _options.splice(index, 1)
        setOptions(_options)
    }

    return (
        <>
            {options.map((option, index) =>
                <div className="p-3 mb-3" key={index}
                    style={{ backgroundColor: edit ? "#FFF" : "#F5F5F5", border: edit ? "1px dashed black" : "none" }}
                >
                    <Form.Row className="mx-0 justify-content-between">
                        <Form.Group className="w-50 pr-2">
                            <Form.Label>Option Name</Form.Label>
                            <Form.Control type='text' value={option.oName || ""} required disabled={!edit}
                                onChange={(e) => setOptionsHandler(index, "oName", e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="w-50 pl-2">
                            <Form.Label>Option CloverID</Form.Label>
                            {edit
                                ? <Form.Control type='text' value={option.cloverID || ""} required
                                    onChange={(e) => setOptionsHandler(index, "cloverID", e.target.value)}>
                                </Form.Control>
                                : <div onClick={() => { if (option.cloverID) history.push(`/admin/inventory/${option.cloverID}/edit`) }} >
                                    <Form.Control type='text' value={option.cloverID || ""} disabled
                                        style={{ cursor: option.cloverID ? "pointer" : "default" }}>
                                    </Form.Control>
                                </div>
                            }
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="mx-0 justify-content-between">
                        <Form.Group className="w-50 pr-2">
                            <Form.Label>Option Price (In Cents)</Form.Label>
                            <Form.Control type='number' value={option.oPrice || ""} required disabled={!edit}
                                onChange={(e) => setOptionsHandler(index, "oPrice", e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="w-50 pl-2" >
                            <Form.Label>Option List Price (In Cents)</Form.Label>
                            <Form.Control type='number' placeholder='(Optional)' value={option.oListPrice || ""} disabled={!edit}
                                onChange={(e) => setOptionsHandler(index, "oListPrice", e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        {/* <Form.Group className="w-50 pl-2">
                    <Form.Label>Option Stock</Form.Label>
                    <Form.Control type='number' value={option.oStock} required disabled={!edit}
                        onChange={(e) => setOptions(e.target.value)}>
                    </Form.Control>
                </Form.Group> */}
                    </Form.Row>
                    {edit && index != 0 && <Button variant='secondary' className="text-danger p-0"
                        // style={{ backgroundColor: "#F5F5F5" }}
                        onClick={() => deleteOptionHandler(index)}>
                        Delete
                    </Button >}
                </div>
            )
            }
            {
                edit && <Button variant="outline-primary" className='mb-3 py-1'
                    onClick={() => setOptions([...options, {}])}>
                    Add Option
                </Button >
            }
        </>
    )
}

export default OptionEditor
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Form, ListGroup, Modal, Table } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { UserContext } from '../contexts/UserContext';
import Loader from './Loader';

const PoSearchModal = ({ show, setShow, fillHandler }) => {

    const user = useContext(UserContext)
    const [inventoryList, setInventoryList] = useState([])
    const [search, setSearch] = useState("")


    // Query: Fill in Details  
    const { isLoading, data } = useQuery(`inventoryList?${search}`, () => {
        return axios.get(`/api/inventory?keyword=${search}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            setInventoryList(data.data.inventory)
            console.log(data.data.inventory)
        },
        onError: (error) => {
            console.log(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })

    // Close Modal and Reset
    const closeHandler = () => {
        setShow(false)
        setSearch("")
    }

    // Fill In Item
    const selectHandler = (rowEl) => {
        fillHandler(rowEl.children[0].innerHTML, rowEl.children[1].innerHTML, rowEl.children[2].innerHTML)
        closeHandler()
    }



    return (
        <Modal show={show} onHide={closeHandler} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Search for Inventory Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control placeholder="search" value={search}
                        onChange={(e) => setSearch(e.target.value)}>
                    </Form.Control>
                </Form>
                {isLoading
                    ? <Loader />
                    : <Table hover>
                        <thead>
                            <tr>
                                <th>Clover ID</th>
                                <th>SKU</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryList.filter(inv => inv.cloverName.toLowerCase().includes(search.toLowerCase()))
                                .map(inv => (
                                    <tr key={inv.cloverID} onClick={(e) => selectHandler(e.target.parentNode)} style={{ cursor: "pointer" }}>
                                        <td className="p-2">{inv.cloverID}</td>
                                        {/* <td className="p-2">{`${inv.iParent}${inv.iSelectionName ? ": (" + inv.iSelectionName + ")" : ""}`}</td> */}
                                        <td className="p-2">{inv.iParent}</td>
                                        <td className="p-2">{inv.cloverName}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>}
            </Modal.Body>
        </Modal>
    );
};

export default PoSearchModal;

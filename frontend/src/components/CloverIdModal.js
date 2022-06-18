import axios from 'axios';
import { enabled } from 'colors';
import React, { useContext, useEffect, useState } from 'react';
import { Form, ListGroup, Modal, Table } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { UserContext } from '../contexts/UserContext';
import Loader from './Loader';

const CloverIdModal = ({ show, setShow, merchantData, fillHandler }) => {

    const user = useContext(UserContext)
    const [inventoryList, setInventoryList] = useState([])
    const [search, setSearch] = useState("")

    const { isLoading, data, error } = useQuery([`poCloverSearch`, search], () =>
        axios.get(`/api/inventory?keyword=${search}`, { headers: { Authorization: `Bearer ${user.token}` } }),
        { enabled: show && !!search }
    )

    // Close Modal and Reset
    const closeHandler = () => {
        setShow(false)
        setSearch("")
    }

    // Fill In Item
    const selectHandler = (parentNode) => {
        fillHandler(parentNode.children[0].innerHTML)
        closeHandler()
    }

    useEffect(() => {
        // console.log(merchantData)
        if (merchantData && merchantData.data && merchantData.data.merchantItems) {
            setInventoryList(merchantData.data.merchantItems.
                filter(inv => inv.description.toLowerCase().includes(search.toLowerCase()) ||
                    inv.sku.toLowerCase().includes(search.toLowerCase())))
        }
    }, [merchantData, search])


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
                {<Table hover>
                    <thead>
                        <tr>
                            <th>CloverID</th>
                            <th>Clover Name</th>
                            <th>Product Page</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data && data.data.inventory.map(line => (
                            <tr key={line.sku} onClick={(e) => selectHandler(e.target.parentNode)} style={{ cursor: "pointer" }}>
                                <td className="p-2">{line.cloverID}</td>
                                <td className="p-2">{line.cloverName}</td>
                                <td className="p-2">{line.iParent}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                </Table>}
            </Modal.Body>
        </Modal>
    );
};

export default CloverIdModal;

import axios from 'axios'
import { extract, token_sort_ratio } from 'fuzzball'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { toUSD } from '../common'
import { UserContext } from '../contexts/UserContext'
import useClover from '../hooks/useClover'
import useDebounce from '../hooks/useDebounce'
import Loader from './Loader'

const CloverMatcherSuggestions = ({ queryProp, choice, setChoice, disabled }) => {

    const user = useContext(UserContext)
    const clovers = useClover()
    const [search, setSearch] = useState("")
    const debounced = useDebounce(search, 1000)
    const [error, setError] = useState("")
    const [list, setList] = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [query, setQuery] = useState(queryProp)

    // List Query
    const { isFetching } = useQuery(["inventorySearch", debounced], () => {
        setChoice("")
        return axios.get(`/api/inventory?keyword=${debounced}&limit=10`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => setList(data.data.inventory),
        onError: ({ response, message }) => { setError(response?.data.message || message) },
        enabled: !!debounced
    })

    useEffect(() => { setQuery(queryProp); setSearch("") }, [queryProp])

    useEffect(() => {
        if (isFetching) setList(Array(10).fill({}))
        if (!search) setList(suggestions)
    }, [suggestions, search, isFetching])

    useEffect(() => {
        if (!query) { setSuggestions(Array(10).fill({})); return }
        if (clovers?.length) {
            let results = extract(query, clovers, {
                scorer: token_sort_ratio,
                processor: item => item.cloverName,
                limit: 10
            })
            setSuggestions(results.map(result => result[0]))
        }
    }, [clovers, query])



    if (error) return null
    return (
        <>
            <Form onSubmit={(e) => { e.preventDefault() }} className="mb-1">
                <Form.Control placeholder="Search by Name / ID / SKU"
                    aria-label="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onClick={() => setChoice("")}
                    disabled={disabled}
                />
            </Form>
            <Row className="no-gutters">
                {list.map((sugg, index) => (
                    <Col xs={6} key={sugg.cloverID || index}>
                        <Card>
                            {!sugg.cloverID ? <Loader size="30px" /> :
                                <Button variant={choice == sugg.cloverID ? 'primary' : ''} className="p-0 m-1" id={sugg.cloverID}
                                    style={{ textTransform: "none" }}
                                    onClick={(e) => setChoice(e.currentTarget.id)}
                                    disabled={disabled}
                                >
                                    <Card.Body className="p-1">
                                        <p className="m-0 text-danger">{sugg.cloverSku || "no SKU"}</p>
                                        <p className="m-0">{sugg.cloverName}</p>
                                        <p className="m-0 text-muted">{toUSD(sugg.cloverPrice)}</p>
                                    </Card.Body>
                                </Button>}
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )

}

export default CloverMatcherSuggestions
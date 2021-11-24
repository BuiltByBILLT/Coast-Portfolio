{
    user.isStaff === true &&
    (<ListGroup.Item>
        <Form >
            <Row>
                <Col>
                    {discountEdit ?
                        (
                            <Form.Row>
                                <Col>
                                    <Form.Control type="text" placeholder="Name (Required)" value={discountName} className="p-3"
                                        onChange={(e) => setDiscountName(e.target.value)}
                                    ></Form.Control>
                                </Col>
                                <Col>
                                    <InputGroup>
                                        <DropdownButton
                                            as={InputGroup.Prepend}
                                            variant="outline-secondary"
                                            title={discountType === "$" ? "$" : "%"}
                                            className="p-0"
                                            style={{ height: "47px" }}
                                        >
                                            <Dropdown.Item onClick={() => setDiscountType("$")}>
                                                $
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => setDiscountType("%")}>
                                                %
                                            </Dropdown.Item>
                                        </DropdownButton>
                                        <Form.Control type="text" placeholder="0.00" value={discountAmount} className="p-3"
                                            onChange={(e) => setDiscountAmount(e.target.value)}>
                                        </Form.Control>
                                    </InputGroup>
                                </Col>
                            </Form.Row>
                        ) : (
                            <>
                                <strong>{'Discount: '}</strong>
                                {discountAmount !== "" ?
                                    discountType === "$"
                                        ? `(${discountName}) ${discountType}${discountAmount} off`
                                        : `(${discountName}) ${discountAmount}${discountType} off`
                                    : ""
                                }
                            </>
                        )
                    }
                </Col>
                <Col xs="auto" className="text-right">
                    {discountEdit ?
                        (<Link to="#" className="text-danger"
                            onClick={() => {
                                setDiscountEdit(false)
                                // dispatch({
                                //     type: CART_SET_DISCOUNT, payload: {
                                //         discountName, discountType, discountAmount
                                //     }
                                // })
                            }}
                        >Save</Link>
                        ) : (<Link to="#" className="text-muted"
                            onClick={() => setDiscountEdit(true)}
                        >Change</Link>)
                    }
                </Col>
            </Row>
        </Form>
    </ListGroup.Item>)
}
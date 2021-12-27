import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Container, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getAverage, getLowInv } from '../actions/reportActions'
import ReportCustomRange from '../components/ReportCustomRange'
import ReportDoD from '../components/ReportDoD'
import ReportMoM from '../components/ReportMoM'
import ReportYoY from '../components/ReportYoY'
import ReportLowInv from '../components/ReportLowInv'

const ReportScreen = ({ history, match }) => {


    return (
        <Container className="my-5">
            <Row className='pb-4'>
                <h2 className="mx-auto">Reports</h2>
            </Row>

            <ReportCustomRange />
            <ReportDoD />
            <ReportMoM />
            <ReportYoY />
            <ReportLowInv />

        </Container >
    )
}

export default ReportScreen

import React, { useState } from 'react'
import { Container, Tab, Tabs } from 'react-bootstrap'
import CloverMatcherSolo from '../components/CloverMatcherSolo'
import CloverMatcherParent from '../components/CloverMatcherParent'
import useClover from '../hooks/useClover'
import useProductMatcher from '../hooks/useProductMatcher'
import Loader from '../components/Loader'


const CloverMatcherScreen = ({ match }) => {

    const clovers = useClover()
    const { soloData, parentData } = useProductMatcher()


    const soloProducts = soloData?.data?.products || [{}]
    const parentProducts = parentData?.data?.products || [{}]
    const soloTotal = soloData?.data?.total
    const parentTotal = parentData?.data?.total

    const [soloIndex, setSoloIndex] = useState(0)
    const [parentIndex, setParentIndex] = useState(0)


    if (!soloTotal || !parentTotal) return <Container className="my-5 py-5"><Loader /></Container>
    return (
        <Container className="my-3">
            <Tabs defaultActiveKey="solo" id="uncontrolled-tab-example">
                <Tab eventKey="solo" title={`Solo Products (${soloProducts?.length - soloIndex}/${soloTotal})`}>
                    <CloverMatcherSolo pIDParam={soloProducts[soloIndex].pID} next={() => setSoloIndex(soloIndex + 1)} />
                </Tab>
                <Tab eventKey="parent" title={`Products with Options (${parentProducts?.length - parentIndex}/${parentTotal})`}>
                    <CloverMatcherParent pIDParam={parentProducts[parentIndex].pID} next={() => setParentIndex(parentIndex + 1)} />
                </Tab>
            </Tabs>

        </Container>
    )
}

export default CloverMatcherScreen
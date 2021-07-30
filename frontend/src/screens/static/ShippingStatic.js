import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import "../../styles/Static.css"

const ShippingStatic = () => {
    return (
        <Container className="pb-5">
            <h1 className="text-center text-danger mb-5">Coast Airbrush Shipping Policy</h1>
            <p>
                Coast Airbrush ships to all domestic 48 states, non hazardous orders via UPS ground service. Our shipping fee is $9.00 for all orders under $100.00. Orders over $100.00 are charged at a 9% rate of the subtotal. Some items qualify for Free Shipping. For oversized or heavy weight items there will be additional charges based on the dimensional weight. We will email or phone you prior to charging any extra fees to obtain your approval, unless otherwise stated on the web site. Any air charges are also calculated by weight and destination zip code which will be provided in an email for approval. Because the shopping cart is unable to accurately calculate other than the standard shipping, please disregard the default confirmation if you are requesting additional services. We will adjust the order and email it before finalizing the order. We do not ship to PO boxes unless it is a military address. To request US Postal service, please call or submit a request on your order. Coast Airbrush is not responsible for lost or damaged items being sent USPS. There is also no tracking available for some USPS shipments. Please use the additional comments section of your order to ask for special rates or expedited shipping. In case of damage or discrepancy on order, you must retain all original packaging and contact us within 48 hours of delivery to qualify for a claim. Keep all boxes, etc in case UPS or the US postal service needs to come out and examine the package. If original package is thrown out carrier may not authorize a claim for replacement or refund.
            </p>
            <p>
                *Coast Airbrush does not ship Flammable/Combustible materials by Air. These items are only eligible for Ground Shipping.
            </p>
            <p>
                Coast Airbrush is not responsible for lost or stolen packages in the case of delivery without a signature. We will try to issue a claim with the shipper but that does not guarantee payment. You would be responsible to pay for any re orders in full. If UPS or other shipper pays the claim Coast Airbrush will reimburse you for the full amount of the claim. Please request "signature required" when ordering if you think it may be a problem. There is an additional fee of $4.50 for that service. All orders over $500.00 are sent out automatically signature required at no additional fee. Please be sure to have your order shipped to a location where someone will be available. If the package comes back to us you would be responsible for payment to re ship it. Coast Airbrush & Its parcel carriers are not responsible for items affected by cold climate temperatures, including (but not limited to) frozen paint or other liquids. Please take caution during the Winter months of what you are shipping and where.
            </p>
            <p>
                Military, Alaska Hawaii & Puerto Rico shipments are sent via USPS, unless otherwise requested (Military is USPS only). Additional shipping will be needed for these locations and costs will be calculated after checkout.
            </p>
            <p>
                *Flammable items are not eligible for International delivery, with the exception of Canada. Flammable goods may be transported via UPS Ground Shipping to most of Canada. Please contact us to see if your location is eligible for this service.
            </p>
            <p>
                Shipping charges are non refundable.
            </p>
            <p>
                Mis-Packed or Missing items: Any order with incorrect items or missing items must be reported within 48 hours of the package being delivered. Coast Airbrush will not be held responsible for missing or improper items that are not reported via telephone or Email within 48 hours or the package's delivery date.
            </p>
            <p>
                Coast Airbrush reserves the right to change shipping terms at any time without notice.
            </p>
            <Row className="my-5">
                <Col lg={6}>
                    <Image src="\images\UPSmap1.png" fluid className="pr-5" />
                </Col>
                <Col lg={6} className="pt-4">
                    <h4 className="text-danger">Approximate Shipping Times</h4>
                    <h5 className="mb-4">(Once Shipped)</h5>
                    <p>
                        Orders usually ship within 1-2 business days of being placed. Shipping times illustrated in map are for UPS Ground. Shipping times are approximate and may differ based on region within those zones. Some rural areas or regions may take an extra working day to arrive. Please note that UPS Ground ship times are not guaranteed. If you need your order to arrive within a guaranteed time, please request an Expedited method. *Flammable/Combustible items cannot be expedited. They must be shipped with UPS Ground, only.
                    </p>
                </Col>
            </Row>
            <Row className="my-5">
                <Col lg={6}>
                    <Image src="\images\worldmap.png" fluid className="pr-5" />
                </Col>
                <Col lg={6} className="pt-4">
                    <h4 className="text-danger">Approximate Shipping Cost</h4>
                    <p>
                        NOTE: Costs are approximate and vary based on country and location. This is for roughly estimating possible cost to have a package shipped to your location. Prices are subject to fluctuation. If First Class Mail is preferred and you package weight qualifies, please be sure to request this option in the comments section, when ordering. * First Class Mail is not insured in the event of loss of package or damage in transit.
                    </p>
                </Col>
            </Row>

            <Row className="my-5 pt-5">
                <Col md={6} lg={4} className="staticTableCol"><h5>HAWAII<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $9<br />
                        2lb - $10-$11<br />
                        3lb - $14-$17<br />
                        4lb - $16-$19<br />
                        5lb - $19-$22<br />
                        10lb - $34-$38<br />
                        15lb - $42-$47<br />
                        20lb - $55-$60<br />
                        30lb - $68-$73<br />
                        40lb - $81-$86<br />
                        50lb
                        - $91-$99<br />
                        Max Weight 70lb </p></Col>
                <Col md={6} lg={4} className="staticTableCol"><h5>ALASKA<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $9<br />
                        2lb - $10-$11<br />
                        3lb - $14-$17<br />
                        4lb - $16-$19<br />
                        5lb - $19-$22<br />
                        10lb - $34-$38<br />
                        15lb - $42-$47<br />
                        20lb - $55-$60<br />
                        30lb - $68-$73<br />
                        40lb - $81-$86<br />
                        50lb
                        - $91-$99<br />
                        Max Weight 70lb </p></Col>
                <Col md={6} lg={4} className="staticTableCol"><h5>PUERTO RICO<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $9<br />
                        2lb - $10-$11<br />
                        3lb - $14-$17<br />
                        4lb - $16-$19<br />
                        5lb - $19-$22<br />
                        10lb - $34-$38<br />
                        15lb - $42-$47<br />
                        20lb - $55-$60<br />
                        30lb - $68-$73<br />
                        40lb - $81-$86<br />
                        50lb
                        - $91-$99<br />
                        Max Weight 70lb </p></Col>

                <Col md={6} lg={4} className="staticTableCol">
                    <h5>NORTH AMERICA - CANADA<br />
                        USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $31-$34<br />
                        2lb - $34-$36<br />
                        3lb - $36-$38<br />
                        4lb - $38-$41<br />
                        5lb - $42-$44<br />
                        10lb - $54-$56<br />
                        15lb - $66-$68<br />
                        20lb - $78-$81<br />
                        30lb - $100-$105<br />
                        40lb - $118-$122<br />
                        50lb
                        - $140-$145<br />
                        Max Weight 66lb </p>
                    <h5>USPS First Class Mail (Uninsured)</h5>
                    <p>
                        1lb or less - $11-14<br />
                        1-2lb - $13-$20 <br />
                        2-3lb - $19-$27<br />
                        3-4lb - $26-$33 <br />
                        Max Weight 4lb </p></Col>
                <Col md={6} lg={4} className="staticTableCol"><h5>NORTH AMERICA - MEXICO<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $39-$41<br />
                        2lb - $42-$44<br />
                        3lb - $46-$48<br />
                        4lb - $49-$51<br />
                        5lb - $53-$56<br />
                        10lb - $65-$69<br />
                        15lb - $76-$79<br />
                        20lb - $87-$91<br />
                        30lb - $108-$112<br />
                        40lb - $130-$135<br />
                        50lb
                        - $173-$176<br />
                        Max Weight 70lb </p>
                    <h5>USPS First Class Mail (Uninsured)</h5>
                    <p>
                        1lb or less - $11-14<br />
                        1-2lb - $13-$24 <br />
                        2-3lb - $24-$33<br />
                        3-4lb - $31-$40 <br />
                        Max Weight 4lb </p></Col>
                <Col md={6} lg={4} className="staticTableCol"><h5>CENTRAL AMERICA &amp; CARIBBEAN<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $42-$45<br />
                        2lb - $46-$49<br />
                        3lb - $50-$53<br />
                        4lb - $55-$57<br />
                        5lb - $59-$62<br />
                        10lb - $75-$78<br />
                        15lb - $90-$93<br />
                        20lb - $106-$110<br />
                        30lb - $136-$140<br />
                        40lb - $167-$180<br />
                        50lb
                        - $197-$201<br />
                        Max Weight 66lb </p>
                    <h5>USPS First Class Mail (Uninsured)</h5>
                    <p>
                        1lb or less - $13-21<br />
                        1-2lb - $19-$31 <br />
                        2-3lb - $27-$38<br />
                        3-4lb - $36-$45 <br />
                        Max Weight 4lb </p></Col>

                <Col md={6} lg={4} className="staticTableCol"><h5>SOUTH AMERICA<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $42-$45<br />
                        2lb - $46-$49<br />
                        3lb - $50-$53<br />
                        4lb - $55-$57<br />
                        5lb - $59-$62<br />
                        10lb - $75-$78<br />
                        15lb - $90-$93<br />
                        20lb - $106-$110<br />
                        30lb - $136-$140<br />
                        40lb - $167-$180<br />
                        50lb - $225-$235<br />
                        Max Weight 44-66lb* <br />
                        (varies per location)</p>
                    <h5>USPS First Class Mail (Uninsured)</h5>
                    <p>
                        1lb or less - $13-21<br />
                        1-2lb - $19-$31 <br />
                        2-3lb - $27-$38<br />
                        3-4lb - $36-$45 <br />
                        Max Weight 4lb </p></Col>
                <Col md={6} lg={4} className="staticTableCol"><h5>GREENLAND<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $44-$47<br />
                        2lb - $47-$50<br />
                        3lb - $50-$53<br />
                        4lb - $53-$56<br />
                        5lb - $56-$59<br />
                        10lb - $69-$73<br />
                        15lb - $82-$85<br />
                        20lb - $95-$100<br />
                        30lb - $120-$122<br />
                        40lb - $146-$150<br />
                        50lb
                        - $171-$176<br />
                        Max Weight 66lb </p><br />
                    <h5>USPS First Class Mail (Uninsured)</h5>
                    <p>
                        1lb or less - $15-21<br />
                        1-2lb - $19-$30 <br />
                        2-3lb - $27-$38<br />
                        3-4lb - $35-$45 <br />
                        Max Weight 4lb </p></Col>
                <Col md={6} lg={4} className="staticTableCol"><h5>EUROPE<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $44-$47<br />
                        2lb - $47-$50<br />
                        3lb - $50-$53<br />
                        4lb - $53-$56<br />
                        5lb - $56-$59<br />
                        10lb - $69-$73<br />
                        15lb - $82-$85<br />
                        20lb - $95-$100<br />
                        30lb - $120-$122<br />
                        40lb - $146-$150<br />
                        50lb
                        - $171-$176<br />
                        Max Weight 66lb </p><br />
                    <h5>USPS First Class Mail (Uninsured)</h5>
                    <p>
                        1lb or less - $15-21<br />
                        1-2lb - $19-$30 <br />
                        2-3lb - $27-$38<br />
                        3-4lb - $35-$45 <br />
                        Max Weight 4lb </p></Col>

                <Col md={6} lg={4} className="staticTableCol"><h5>MIDDLE EAST<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $43-$50<br />
                        2lb - $47-$56<br />
                        3lb - $51-$61<br />
                        4lb - $56-$66<br />
                        5lb - $60-$71<br />
                        10lb - $78-$93<br />
                        15lb - $97-$116<br />
                        20lb - $115-$139<br />
                        30lb - $151-$183<br />
                        40lb - $188-$227<br />
                        50lb
                        - $255-$275<br />
                        Max Weight 44-66lb* <br />
                        (varies per location)</p>
                    <h5>USPS First Class Mail (Uninsured)</h5>
                    <p>
                        1lb or less - $15-21<br />
                        1-2lb - $19-$30 <br />
                        2-3lb - $27-$38<br />
                        3-4lb - $35-$45 <br />
                        Max Weight 4lb </p></Col>
                <Col md={6} lg={4} className="staticTableCol"><h5>AFRICA<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $43-$50<br />
                        2lb - $47-$56<br />
                        3lb - $51-$61<br />
                        4lb - $56-$66<br />
                        5lb - $60-$71<br />
                        10lb - $78-$99<br />
                        15lb - $97-$128<br />
                        20lb - $115-$156<br />
                        30lb - $151-$215<br />
                        40lb - $188-$270<br />
                        50lb
                        - $225-$330<br />
                        Max Weight 44-66lb* <br />
                        (varies per location)</p>
                    <h5>USPS First Class Mail (Uninsured)</h5>
                    <p>
                        1lb or less - $15-21<br />
                        1-2lb - $19-$30 <br />
                        2-3lb - $27-$38<br />
                        3-4lb - $36-$47 <br />
                        Max Weight 4lb </p></Col>
                <Col md={6} lg={4} className="staticTableCol"><h5>RUSSIA<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $48-$50<br />
                        2lb - $53-$56<br />
                        3lb - $58-$61<br />
                        4lb - $63-$66<br />
                        5lb - $68-$71<br />
                        10lb - $90-$93<br />
                        15lb - $112-$118<br />
                        20lb - $135-$140<br />
                        30lb - $179-$185<br />
                        40lb - $223-$230<br />
                        44lb
                        - $241-$250<br />
                        Max Weight 44</p>
                    <br />
                    <h5>USPS First Class Mail (Uninsured)</h5>
                    <p>
                        1lb or less - $15-21<br />
                        1-2lb - $19-$30 <br />
                        2-3lb - $27-$38<br />
                        3-4lb - $35-$47 <br />
                        Max Weight 4lb </p></Col>

                <Col md={6} lg={4} className="staticTableCol"><h5>ASIA<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $42-$52<br />
                        2lb - $47-$56<br />
                        3lb - $52-$60<br />
                        4lb - $57-$66<br />
                        5lb - $61-$71<br />
                        10lb - $75-$86<br />
                        15lb - $89-$104<br />
                        20lb - $104-$122<br />
                        30lb - $132-$160<br />
                        40lb - $161-$199<br />
                        50lb
                        - $180-$245<br />
                        Max Weight 44-66lb* <br />
                        (varies per location)</p>
                    <h5>USPS First Class Mail (Uninsured)</h5>
                    <p>
                        1lb or less - $15-21<br />
                        1-2lb - $19-$30 <br />
                        2-3lb - $27-$38<br />
                        3-4lb - $35-$47 <br />
                        Max Weight 4lb </p></Col>
                <Col md={6} lg={4} className="staticTableCol"><h5>SOUTH EAST ASIA<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $46-$50<br />
                        2lb - $50-$56<br />
                        3lb - $53-$61<br />
                        4lb - $57-$62<br />
                        5lb - $61-$65<br />
                        10lb - $80-$85<br />
                        15lb - $99-$105<br />
                        20lb - $117-$121<br />
                        30lb - $155-$161<br />
                        40lb - $192-$200<br />
                        50lb
                        - $230-$245<br />
                        Max Weight 44-66lb* <br />
                        (varies per location)</p>
                    <h5>USPS First Class Mail (Uninsured)</h5>
                    <p>
                        1lb or less - $15-21<br />
                        1-2lb - $19-$30 <br />
                        2-3lb - $27-$38<br />
                        3-4lb - $35-$47 <br />
                        Max Weight 4lb </p></Col>
                <Col md={6} lg={4} className="staticTableCol"><h5>AUSTRALIA - NEW ZEALAND<br />
                    USPS - Priority Mail (Insured) </h5>
                    <p>1lb - $47-$50<br />
                        2lb - $51-$55<br />
                        3lb - $55-$61<br />
                        4lb - $60-$64<br />
                        5lb - $64-$70<br />
                        10lb - $88-$92<br />
                        15lb - $111-$118<br />
                        20lb - $135-$140<br />
                        30lb - $181-$189<br />
                        40lb - $228-$236<br />
                        50lb
                        - $274-$285<br />
                        Max Weight 66lb</p><br />
                    <h5>USPS First Class Mail (Uninsured)</h5>
                    <p>
                        1lb or less - $15-21<br />
                        1-2lb - $19-$30 <br />
                        2-3lb - $27-$38<br />
                        3-4lb - $35-$47 <br />
                        Max Weight 4lb </p></Col>
            </Row>

        </Container >
    )
}

export default ShippingStatic

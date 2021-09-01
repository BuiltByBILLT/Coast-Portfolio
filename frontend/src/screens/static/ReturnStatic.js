import React from 'react'
import { Container } from 'react-bootstrap'
import "../../styles/Static.css"

const ReturnStatic = () => {
    return (
        <Container className="py-5">
            <h2 className="text-center text-danger mb-5">Coast Return Policy</h2>
            <h5 className="my-2">Coast Airbrush does not accept returns or exchanges on the following items</h5>
            <ul>
                <li>Books, Videos & DVD's, Magazines & Projectors (unless a manufacturer defect within warranty</li>
                <li>Compressors (unless a manufacturer defect within warranty)</li>
                <li>Flakes and Dry Pearls</li>
            </ul>
            <h6 className="staticH6">Made to Order Paints</h6>
            <ul>
                <li>Small Quantity Pour Downs (HOK/SEM)</li>
                <li>HOK Aerosol Cans</li>
            </ul>
            <ul>
                <li>Special Request Kits</li>
                <li>Special Order / Non Stock Items</li>
                <li>ANY used equipment</li>
                <li>ANY opened paints</li>
            </ul>

            <p>
                For all non paint items we offer a return or exchange within 30 days of purchase or delivery. Items must be in original packaging, unopened, unused and in resell-able condition. You must contact us for a Return Authorization number prior to returning any item(s). If we receive a return without an authorization number it will not be accepted for a refund. Provided it meets all of the criteria stated above we can offer store credit. Any shipping charges are non-refundable as well. Coast Airbrush does NOT pay for return shipping unless there has been a mistake in packaging on our end. We are also not responsible if the authorized return arrives damaged to us so please take care when returning via the US Postal Service. There is a 15% re-stocking fee applied to all returns. The re-stocking fee will be waived in the case of an exchange of equal or greater value or store credit. Coast Airbrush reserves the right to refuse any return at any time. Paint returns or exchanges must be within 14 days of purchase or delivery and meet all above criteria. Special order paints & specially mixed paints are non returnable or exchangeable. Do NOT ship back any flammable goods via USPS. In case of damage, you must retain all original packaging and contact us within 48 hours of delivery to qualify for a claim. Keep all boxes, etc in case UPS or the US postal service needs to come out and examine the package. If original package is thrown out, UPS will not authorize a claim for replacement or refund. Coast Airbrush reserves the right to add, delete, or revise these terms and conditions at our sole discretion at any time.
            </p>
            <h5 className="mb-2 mt-5">International Returns / Customs Clearance</h5>
            <p>
                Coast Airbrush is not responsible for undeliverable or unclaimed packages as well as refused packages in the event you decline to pay the duties, taxes or brokerage fees. There is a 15% restocking fee in the event a package is returned to us and you wish to be refunded for the order. The restocking fee will be waived in the event you wish to retain a store credit or have the package shipped back out. If you wish to ship the package again, you must pay the current shipping rates to have the package sent. All Shipping & Processing fees are non refundable.
            </p>
        </Container>
    )
}

export default ReturnStatic

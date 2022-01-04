import asyncHandler from 'express-async-handler'
import axios from 'axios'
import Label from '../models/labelModel.js'

dotenv.config()
const LABEL_URL = process.env.NODE_ENV === "development" ? `https://wwwcie.ups.com/ship/v1807/shipments` : `https://onlinetools.ups.com/ship/v1807/shipments`,

// @desc Verify Address
// @route POST /api/shipping/ups/AV
// @access Staff
const addressVerification = asyncHandler(async (req, res) => {
    const { address1, address2, city, country, region, postalCode } = req.body
    let body = {
        "UPSSecurity": {
            "UsernameToken": {
                "Username": "Coast Airbrush",
                "Password": "daytona30"
            },
            "ServiceAccessToken": {
                "AccessLicenseNumber": "EDA5BD9C0D495E31"
            }
        },
        "XAVRequest": {
            "Request": {
                "RequestOption": "1",
                "TransactionReference": {
                    "CustomerContext": "Website"
                }
            },
            "AddressKeyFormat": {
                // "AddressLine": ["1652 W Frankfort Rd"],
                // "PoliticalDivision2": "Carrollton",
                // "PoliticalDivision1": "TX",
                // "PostcodePrimaryLow": "75007",
                "AddressLine": [address1, address2],
                "PoliticalDivision2": city,
                "PoliticalDivision1": region,
                "PostcodePrimaryLow": postalCode,
                "CountryCode": "US"
            }
        }
    }

    try {
        const { data } = await axios.post(`https://onlinetools.ups.com/rest/XAV`, body)
        // console.log(JSON.stringify(data))
        if (data.Fault) throw new Error(data.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Description)
        if ("NoCandidatesIndicator" in data.XAVResponse) throw new Error("No Valid Address Matches")

        res.json(data)
    } catch (error) {
        if (error.response) {
            console.log(error.response.data)
            throw new Error(error.response.data)
        } else if (error.request) {
            console.log(error.request);
            throw new Error("No Response")
        } else {
            console.log('Error', error.message);
            throw error
        }
    }
})



// @desc Create UPS Shipping Label
// @route POST /api/shipping/ups/:orderID/:size
// @access Staff
const createUPS = asyncHandler(async (req, res) => {
    const orderID = req.params.orderID
    const size = req.params.size
    let tracking = ""
    let raw = ""
    let resp = ""
    const { email, firstName, lastName, company, address1, address2, city, country, region, postalCode, phone } = req.body
    // console.log(company)
    console.log(region)
    // console.log(lastName)
    // console.log(phone)

    let body = {
        "ShipmentRequest": {
            "Shipment": {
                "Shipper": {
                    "Name": "Coast Airbrush",
                    "AttentionName": "Coast Airbrush",
                    "Phone": {
                        "Number": "7146355557",
                    },
                    "ShipperNumber": "7X4039",
                    "Address": {
                        "AddressLine": "312 N. Anaheim Blvd",
                        "City": "Anaheim",
                        "StateProvinceCode": "CA",
                        "PostalCode": "92805",
                        "CountryCode": "US"
                    }
                },
                "ShipTo": {
                    "Name": company ? company : firstName + " " + lastName,
                    "AttentionName": company ? firstName + " " + lastName : "",
                    // "Phone": {
                    //     "Number": phone ? phone ""
                    // },
                    "Address": {
                        "AddressLine": [address1, address2],
                        "City": city,
                        "StateProvinceCode": region,
                        "PostalCode": postalCode,
                        "CountryCode": "US"
                    }
                },
                "PaymentInformation": {
                    "ShipmentCharge": {
                        "Type": "01",
                        "BillShipper": {
                            "AccountNumber": "7X4039"
                        }
                    }
                },
                "Service": {
                    "Code": "03",
                    "Description": "service Description"
                },
                "Package": {
                    "Packaging": {
                        "Code": "02",
                        "Description": "Customer Supplied Package"
                    },
                    "PackageWeight": {
                        "UnitOfMeasurement": {
                            "Code": "LBS"
                        },
                        "Weight": size
                    }
                }
            },
            "LabelSpecification": {
                "LabelImageFormat": {
                    "Code": "PNG"
                },
                "HTTPUserAgent": "Mozilla/4.5"
            }
        }
    }

    try {
        const { data } = await axios.post(
            LABEL_URL,
            body,
            {
                headers: {
                    "Content-Type": "application/ json",
                    "AccessLicenseNumber": process.env.UPS_ACCESS,
                    "Username": "Coast Airbrush",
                    "Password": process.env.UPS_PASS,
                    "transId": orderID,
                    "transactionSrc": "Website",
                }
            }
        )
        tracking = data.ShipmentResponse.ShipmentResults.PackageResults.TrackingNumber
        raw = data.ShipmentResponse.ShipmentResults.PackageResults.ShippingLabel.GraphicImage
        resp = data

    } catch (error) {
        if (error.response) {
            console.log(error.response.data.response.errors[0].message)
            throw new Error(error.response.data.response.errors[0].message)
        } else if (error.request) {
            console.log(error.request);
            throw new Error("No Response")
        } else {
            console.log('Error', error.message);
            throw new Error("Server Something Error")
        }
    }

    // Save to DB
    try {
        const label = await Label.create({ orderID, tracking, raw })
        res.json(resp)
    } catch (error) {
        throw new Error("Unable to Save Tracking Number to Database")
    }
})




export {
    createUPS,
    addressVerification
}
import asyncHandler from 'express-async-handler'
import Avatax from 'avatax'
import dotenv from 'dotenv'
dotenv.config()


// resolve configuration and credentials
// const config = {
//     appName: 'CoastAirbrush',
//     appVersion: '1.0',
//     environment: 'production',
//     machineName: 'linode_server'
// };

// const creds = {
//     username: process.env.AVATAX_USERNAME_PROD,
//     password: process.env.AVATAX_PASSWORD_PROD
// };
// console.log(process.env.AVATAX_USERNAME_PROD, process.env.AVATAX_PASSWORD_PROD)
// var client = new Avatax(config).withSecurity(creds);

// @desc Get Tax Rate from Address
// @route POST /api/tax/fetch
// @access Public
const fetchTax = asyncHandler(async (req, res) => {

    const result = await client.taxRatesByAddress(req.body)
    //   console.log(result);
    res.json(result.totalRate)
})

// @desc Get Validate Address
// @route POST /api/tax/address
// @access Public
const addressTax = asyncHandler(async (req, res) => {
    const address = {
        city: 'irvine',
        postalCode: '92615',
        region: 'ca',
        country: 'us'
    };

    const result = await client.resolveAddress(address)
    console.log(result);
    res.json(result)
})



export {
    fetchTax,
    addressTax,
}
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import mongoose from 'mongoose'
import axios from 'axios'
import Inventory from './models/inventoryModel.js'
import Zap from './models/zapModel.js'
import Order from './models/orderModel.js'

dotenv.config()
// Always Prod
const CLOVER_KEY = process.env.NODE_ENV === "development" ? process.env.CLOVER_PROD_KEY : process.env.CLOVER_KEY
const CLOVER_URL = process.env.NODE_ENV === "development" ? process.env.CLOVER_PROD_URL : process.env.CLOVER_URL


console.log("running")
await connectDB()


// Update QB
async function sendToQB(order) {
    console.log("QB start")
    // parse order
    const id = order.id
    const lineItems = order.lineItems.elements
    const total = order.payments.elements[0].amount
    const tax = order.payments.elements[0].taxAmount
    const subtotal = 0
    const hasShipping = false
    console.log({ id, lineItems, total, tax })


    // if (shipping.price && tax) {

    //     const { data } = await axios.post(
    //         process.env.ZAPIER_URL,
    //         {
    //             id,
    //             subtotal: subtotal / 100,
    //             shipping: shipping.price / 100,
    //             tax: tax / 100,
    //         }
    //     )
    //     if (data.status == "success") console.log("Zapier Success!")
    //     else console.log("Zapier Post Failed")
    // } else {
    //     console.log("Zapier Fail: shipping or tax not found")
    // }
}

// Update Inv
async function updateInv(cartItems) {
    console.log("updateInv start")
    for (const item of cartItems) {
        await Inventory.findOneAndUpdate({ cloverID: item.cloverID }, { $inc: { iStock: -item.qty } })
    }
    console.log("updateInv finished!")
}


const main = async () => {
    const newZaps = []
    const newInv = []
    try {
        const latest = await axios.get(
            CLOVER_URL + `/orders`
            + `?limit=1`
            + `&expand=lineItems`
            + `&expand=payments`
            + `&filter=payType=full`,
            { headers: { "Authorization": `Bearer ${CLOVER_KEY}` } }
        )

        // newZaps
        for (const order of latest.data.elements) {
            const found = await Zap.findOne({ orderID: "order.id" })
            if (found) continue
            else newZaps.push(order)
        }
        console.log("new zaps:", newZaps.map(zap => zap.id))
        // send to QB
        for (const zap of newZaps) {
            await sendToQB(zap)
        }

        // newInv
        // for (const order of latest.data.elements) {
        //     const found = await Zap.findOne({ orderID: "order.id" })
        //     if (found) continue
        //     else newZaps.push(order)
        // }
        // console.log("new inv:", newZaps)


    } catch (error) {
        console.log(error)
    } finally {
        mongoose.disconnect()
    }
}

await main()

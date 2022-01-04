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

const main = async () => {

    try {
        const latest = await axios.get(
            CLOVER_URL + `/orders`
            + `?limit=100`
            + `&filter=payType=full`,
            { headers: { "Authorization": `Bearer ${CLOVER_KEY}` } }
        )
        const orderIDs = latest.data.elements.map(orders => { return { orderID: orders.id } })
        console.log(orderIDs)
        await Order.insertMany(orderIDs)
        await Zap.insertMany(orderIDs)
    } catch (error) {
        console.log(error)
    } finally {
        mongoose.disconnect()
    }
}

await main()

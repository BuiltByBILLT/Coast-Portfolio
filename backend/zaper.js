import dotenv from 'dotenv'
import connectDB from './config/db.js'
import axios from 'axios'
import Zap from './models/zapModel.js'
import Storder from './models/storderModel.js'


// always Prod
const CLOVER_KEY = process.env.NODE_ENV === "development" ? process.env.CLOVER_PROD_KEY : process.env.CLOVER_KEY
const CLOVER_URL = process.env.NODE_ENV === "development" ? process.env.CLOVER_PROD_URL : process.env.CLOVER_URL



const getLatestOrder = async (limit) => {

    const { data } = await axios.get(
        process.env.CLOVER_URL + `/orders?limit=${limit}&expand=lineItems`,
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    )
    const fresh = data.elements
    // .map(order => order.id)
    console.log("fresh:", fresh)


    // Update QB
    const zaps = await Zap.find({}).sort({ createdAt: -1 }).limit(limit)
    const zapIDs = zaps.map(order => order.orderID)
    console.log(zapIDs)
    // Get Diff


    // Update Inv
    const storders = await Storder.find({}).sort({ createdAt: -1 }).limit(limit)
    const storderIDs = storders.map(order => order.orderID)

    console.log(storderIDs)
    // Get Diff



}

// await getLatestOrder(10)
const zaper = async () => {

    dotenv.config()
    console.log("running")
    try {

        await connectDB()

        console.log("start")
        console.log("New Order Check:", new Date())
        await getLatestOrder(10)
        await new Promise(r => setTimeout(r, 2000));
        process.exit(0)
    } catch {
        process.exit(1)
    }
}
zaper()
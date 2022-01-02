import dotenv from 'dotenv'
import connectDB from './config/db.js'
import axios from 'axios'
import Inventory from './models/inventoryModel.js'
import Zap from './models/zapModel.js'

dotenv.config()
// const CLOVER_KEY = process.env.NODE_ENV === "development" ? process.env.CLOVER_PROD_KEY : process.env.CLOVER_KEY
// const CLOVER_URL = process.env.NODE_ENV === "development" ? process.env.CLOVER_PROD_URL : process.env.CLOVER_URL


console.log("running")
await connectDB()

const main = async () => {
    const zaps = await Zap.find({})
    console.log(zaps.length)
}

await main()

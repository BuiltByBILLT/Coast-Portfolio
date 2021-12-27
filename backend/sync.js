import dotenv from 'dotenv'
import connectDB from './config/db'
import axios from 'axios'
import Inventory from './models/inventoryModel.js'

dotenv.config()
connectDB()

const lastSeenOrder = ""

const getLatestOrder = async () => {
    const { data } = await axios.get(
        process.env.CLOVER_URL + `/orders?limit=1`,
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    )
    console.log(data)
}
getLatestOrder()
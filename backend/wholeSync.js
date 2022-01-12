import dotenv from 'dotenv'
import connectDB from './config/db.js'
import mongoose from 'mongoose'
import axios from 'axios'
import Inventory from './models/inventoryModel.js'
import csvtojson from 'csvtojson'
import XlsxDataAsJson from 'xlsx_data_as_json'

dotenv.config()
// // Always Prod
const CLOVER_KEY = process.env.NODE_ENV === "development" ? process.env.CLOVER_PROD_KEY : process.env.CLOVER_KEY
const CLOVER_URL = process.env.NODE_ENV === "development" ? process.env.CLOVER_PROD_URL : process.env.CLOVER_URL


console.log("running")
await connectDB()

const getTime = () => {
    const now = new Date().toLocaleTimeString('en-US')
    return now
}


// var cloverRaw = XlsxDataAsJson.parseFile(process.cwd() + "\\backend\\cloverRaw.xlsx");
// cloverRaw = cloverRaw.filter(row => row['Clover ID'])
// console.log("from Clover export", cloverRaw.length)



const wholeSync = async () => {
    // Get All Clover
    console.log(getTime(), "Start Stock Fetch")
    let clover = []
    try {
        const selected = { data: { elements: [] } }
        let buffer = { data: { elements: [] } }
        for (let i = 0; i < 40; i++) {
            if (buffer.data.elements.length === 1000 || i === 0) {
                buffer = await axios.get(
                    CLOVER_URL + `/item_stocks`
                    // CLOVER_URL + `/items`
                    + `?limit=1000`
                    + `&offset=${i * 1000}`,
                    { headers: { "Authorization": `Bearer ${CLOVER_KEY}` } }
                )
                selected.data.elements = [...selected.data.elements, ...buffer.data.elements]
                await new Promise(r => setTimeout(r, 1000)); // Pause for congestion
            } else break
        }
        clover = [...selected.data.elements]
        // console.log("from clover item_stock api", clover.length)
    } catch (error) { console.log(error) }


    // Get All DB
    console.log(getTime(), "Start DB Fetch")
    let mongo = []
    try {
        mongo = await Inventory.find({})
        console.log("mongo", mongo.length)
    } catch (error) { console.log(error) }


    // Compare
    for (const stockItem of clover) {
        const dbItem = mongo.find(({ cloverID }) => cloverID === stockItem.item.id);
        if (!dbItem) {
            console.log("Not in DB:", stockItem.item.id)
            continue
        }
        if (stockItem.stockCount === dbItem.iStock) continue
        await Inventory.findOneAndUpdate({ cloverID: stockItem.item.id }, { iStock: stockItem.stockCount })
        console.log(`${stockItem.item.id}: (DB) ${dbItem.iStock} --> ${stockItem.stockCount} (Clover)`)
    }

    console.log(getTime(), "Finished DB Update")
}

await wholeSync()
mongoose.disconnect()


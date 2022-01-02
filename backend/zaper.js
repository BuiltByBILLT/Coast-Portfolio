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

// Zap.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
//     console.log( post );
//   });

// let lastQB = ["D462P0D38E0V2"]
// let lastInv = ["K36B5XHMYN49R"]
// let fresh = []

const getLatestOrder = async () => {
    console.log(new Date())
    console.log("lastOrder:", lastOrder)

    const { data } = await axios.get(
        process.env.CLOVER_URL + `/orders?limit=10&expand=lineItems`,
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    )
    fresh = data.elements.map(order => order.id)
    console.log("fresh:", fresh)

    // Get Diff
    if (fresh[0] === lastQB[0]) {
        console.log("Same Orders, no QuickBooks change needed")
    } else {
        for (var i = 0; i < fresh.length; i++) {
            if (fresh[i] === lastQB[0]) break
            else continue
        }
        const diffQB = data.elements.splice(0, i)
        console.log("new orders:", diffQB)

        // Update QB

        // Update Inv

    }

}

await getLatestOrder()
await new Promise(r => setTimeout(r, 2000));
console.log("here")
await getLatestOrder()
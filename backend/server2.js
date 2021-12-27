import dotenv from 'dotenv'
import connectDB from './config/db.js'
import axios from 'axios'
import Inventory from './models/inventoryModel.js'
dotenv.config()


console.log("running")
// await connectDB()
let lastQB = ["D462P0D38E0V2"]
let lastInv = ["K36B5XHMYN49R"]
let fresh = []

const getLatestOrder = async () => {
    console.log(new Date())
    console.log("lastQB:", lastQB)
    console.log("lastInv:", lastInv)

    const { data } = await axios.get(
        process.env.CLOVER_URL + `/orders?limit=10&expand=lineItems`,
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    )
    fresh = data.elements.map(order => order.id)
    console.log("fresh:", fresh)

    // Update QB
    if (fresh[0] === lastQB[0]) {
        console.log("Same Orders, no QuickBooks change needed")
    } else {
        for (var i = 0; i < fresh.length; i++) {
            if (fresh[i] === lastQB[0]) break
            else continue
        }
        const diffQB = data.elements.splice(0, i)
        console.log("new QuickBooks orders:", diffQB)
        // Update QB
    }

    // Update Inv
    if (fresh[0] === lastInv[0]) {
        console.log("Same Orders, no Inventory change needed")
    } else {
        for (var i = 0; i < fresh.length; i++) {
            if (fresh[i] === lastInv[0]) break
            else continue
        }
        const diffInv = data.elements.splice(0, i)
        console.log("new Inventory orders:", diffInv)
        // Update Inv
    }


}

await getLatestOrder()
await new Promise(r => setTimeout(r, 2000));
console.log("here")
await getLatestOrder()
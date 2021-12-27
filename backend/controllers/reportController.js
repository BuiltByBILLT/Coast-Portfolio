import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import Inventory from '../models/inventoryModel.js'
import axios from 'axios'


// @desc Get Low Inventory
// @route GET /api/reports/low
// @access Staff
const getLowInv = asyncHandler(async (req, res) => {
    const products = await Inventory.find({ iStock: { $lte: 5 } }).sort({ iStock: 1 })
    res.json(products)
})


// @desc Get DoD  Report
// @route Post /api/reports/dod
// @access Staff
const dodReport = asyncHandler(async (req, res) => {
    const { start } = req.body
    const before = start - 86400000
    const after = start + 86400000

    const current = await axios.get(
        process.env.CLOVER_URL + `/orders`
        + `?limit=1000`
        + `&filter=clientCreatedTime>${start}`
        + `&filter=clientCreatedTime<${after}`
        + `&filter=payType=full`,
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    ).catch(error => console.log(error.response.data))

    const prev = await axios.get(
        process.env.CLOVER_URL + `/orders`
        + `?limit=1000`
        + `&filter=clientCreatedTime>${before}`
        + `&filter=clientCreatedTime<${start}`
        + `&filter=payType=full`,
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    ).catch(error => console.log(error.response.data))

    // Current
    const selectedTotals = current.data.elements.reduce((acc, curr) => { return acc + curr.total }, 0)
    // Prev
    const prevTotals = prev.data.elements.reduce((acc, curr) => { return acc + curr.total }, 0)

    res.json({ selectedTotals, prevTotals })
})

// @desc Get MoM  Report
// @route Post /api/reports/mom
// @access Staff
const momReport = asyncHandler(async (req, res) => {
    const { startString } = req.body
    const [year, month, date] = startString.split('-')

    const start = new Date(year, month - 1).getTime()
    const before = new Date(year, month - 2).getTime()
    const after = new Date(year, month).getTime()

    // Current
    let selectedTotals = 0
    let selectedCount = 0
    let selected = { data: { elements: [] } }
    for (let i = 0; i < 40; i++) {
        if (selected.data.elements.length === 1000 || i === 0) {
            selected = await axios.get(
                process.env.CLOVER_URL + `/orders`
                + `?limit=1000`
                + `&offset=${i * 1000}`
                + `&filter=clientCreatedTime>${start}`
                + `&filter=clientCreatedTime<${after}`
                + `&filter=payType=full`,
                { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
            ).catch(error => console.log(error.response.data))
            selectedTotals = selectedTotals + selected.data.elements.reduce((acc, curr) => { return acc + curr.total }, 0)
            selectedCount = selectedCount + selected.data.elements.length
        } else break
    }

    // Prev
    let prevTotals = 0
    let prevCount = 0
    let prev = { data: { elements: [] } }
    for (let i = 0; i < 40; i++) {
        if (prev.data.elements.length === 1000 || i === 0) {
            prev = await axios.get(
                process.env.CLOVER_URL + `/orders`
                + `?limit=1000`
                + `&offset=${i * 1000}`
                + `&filter=clientCreatedTime>${before}`
                + `&filter=clientCreatedTime<${start}`
                + `&filter=payType=full`,
                { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
            ).catch(error => console.log(error.response.data))
            prevTotals = prevTotals + prev.data.elements.reduce((acc, curr) => { return acc + curr.total }, 0)
            prevCount = prevCount + prev.data.elements.length
        } else break
    }

    res.json({ selectedTotals, prevTotals, start, before, after, prevCount, selectedCount })

})

// @desc Get YoY  Report
// @route Post /api/reports/yoy
// @access Staff
const yoyReport = asyncHandler(async (req, res) => {
    const { startString } = req.body
    const [year, month, date] = startString.split('-')

    const start = new Date(year, 0).getTime()
    const before = new Date(year - 1, 0).getTime()
    const after = new Date(year + 1, 0).getTime()

    // Current
    let selectedTotals = 0
    let selectedCount = 0
    let selected = { data: { elements: [] } }
    for (let i = 0; i < 40; i++) {
        if (selected.data.elements.length === 1000 || i === 0) {
            selected = await axios.get(
                process.env.CLOVER_URL + `/orders`
                + `?limit=1000`
                + `&offset=${i * 1000}`
                + `&filter=clientCreatedTime>${start}`
                + `&filter=clientCreatedTime<${after}`
                + `&filter=payType=full`,
                { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
            ).catch(error => console.log(error.response.data))
            selectedTotals = selectedTotals + selected.data.elements.reduce((acc, curr) => { return acc + curr.total }, 0)
            selectedCount = selectedCount + selected.data.elements.length
        } else break
    }

    // Prev
    let prevTotals = 0
    let prevCount = 0
    let prev = { data: { elements: [] } }
    for (let i = 0; i < 40; i++) {
        if (prev.data.elements.length === 1000 || i === 0) {
            prev = await axios.get(
                process.env.CLOVER_URL + `/orders`
                + `?limit=1000`
                + `&offset=${i * 1000}`
                + `&filter=clientCreatedTime>${before}`
                + `&filter=clientCreatedTime<${start}`
                + `&filter=payType=full`,
                { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
            ).catch(error => console.log(error.response.data))
            prevTotals = prevTotals + prev.data.elements.reduce((acc, curr) => { return acc + curr.total }, 0)
            prevCount = prevCount + prev.data.elements.length
        } else break
    }

    res.json({ selectedTotals, prevTotals, start, before, after, prevCount, selectedCount })
})


// @desc Get Custom Range Report
// @route Post /api/reports/custom
// @access Staff
const customRangeReport = asyncHandler(async (req, res) => {
    const { start, end } = req.body

    let selected = { data: { elements: [] } }
    let buffer = { data: { elements: [] } }
    for (let i = 0; i < 40; i++) {
        if (buffer.data.elements.length === 1000 || i === 0) {
            buffer = await axios.get(
                process.env.CLOVER_URL + `/orders`
                + `?limit=1000`
                + `&offset=${i * 1000}`
                + `&expand=lineItems`
                + `&filter=clientCreatedTime>${start}`
                + `&filter=clientCreatedTime<${end}`
                + `&filter=payType=full`,
                { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
            ).catch(error => console.log(error.response.data))
            selected.data.elements = [...selected.data.elements, ...buffer.data.elements]
        } else break
    }


    // Total Orders
    const totalOrders = selected.data.elements.length
    // Average Value
    const totalTotals = selected.data.elements.reduce((acc, curr) => { return acc + curr.total }, 0)
    const averageValue = totalTotals / totalOrders

    // Fill Qty and Price
    const soldQty = {}
    const soldPrice = {}
    selected.data.elements.forEach(order => {
        order.lineItems.elements.forEach(lineItem => {
            if (lineItem.item && lineItem.item.id) {
                let id = lineItem.item.id
                let price = lineItem.price
                soldQty[id] = soldQty[id] ? soldQty[id] + 1 : 1
                soldPrice[id] = soldPrice[id] ? soldPrice[id] + price : price
            }
        })
    });
    // Sort Qty and Price
    const topQty = Object.entries(soldQty).sort((a, b) => b[1] - a[1]).slice(0, 10)
    const topPrice = Object.entries(soldPrice).sort((a, b) => b[1] - a[1]).slice(0, 10)

    for (let i = 0; i < 10; i++) {
        let cloverID = topQty[i][0];
        let cloverName = await Inventory.findOne({ cloverID: cloverID }, { cloverName: 1, _id: 0 })
        topQty[i][0] = cloverName ? cloverName.cloverName : cloverID
    }
    for (let i = 0; i < 10; i++) {
        let cloverID = topPrice[i][0];
        let cloverName = await Inventory.findOne({ cloverID: cloverID }, { cloverName: 1, _id: 0 })
        topPrice[i][0] = cloverName ? cloverName.cloverName : cloverID
    }

    // Categories
    // catQty, catPrice = {}
    // for soldQty and soldPrice
    // find Product, if(parent)
    // product.sectionID
    // fill catQty, catPrice
    // sort and slice
    // find Cat Name
    // replace catID with catName


    res.json({ topQty, topPrice, totalOrders, averageValue })
})



export {
    getLowInv,
    dodReport,
    momReport,
    yoyReport,
    customRangeReport,
}
// const csv = require('csvtojson');
import csv from "csvtojson"
import products from './data/products.js'
let count = 0


const testFunc = async () => {
    const clover = await csv().fromFile("./backend/data/Clover Inventory - Items.csv");
    console.log("products", products.length)
    // console.log("products[0]", products[0])
    console.log("Clover", clover.length)
    // console.log("Clover[0]", clover[0])
    products[0].clover = "hi"
    // console.log("products[0]", products[0])
    // for (var product of products) {
    for (const cProduct of clover) {
        // if (cProduct.SKU == product.pID) {
        if (cProduct.SKU) {
            count++
        }
    }
    // }

    // products.forEach(product => {
    //     if (product.clover)
    //         count++
    // });
    console.log(count)
}

testFunc().catch(e => console.log(e))


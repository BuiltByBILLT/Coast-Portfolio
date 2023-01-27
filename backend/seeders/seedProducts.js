import connectDB from '../config/db.js'
import dotenv from 'dotenv'

import XlsxDataAsJson from "xlsx_data_as_json"
import csvtojson from 'csvtojson'

import Inventory from '../models/inventoryModel.js'
import Product from '../models/ProductModel.js'
import Category from '../models/categoryModel.js'

import { matchChildren } from './matchChildren.js'

const matchProducts = async (productsWithOptions, cloverInv, options, optionGroups, categories) => {
    try {

        // ============================Disabling Products============================
        // Disable Products in Disabled Categories 
        let turnedOffCat = 0
        productsWithOptions.forEach(product => {
            let category = categories.find(category => category.sectionID == product.pSection)
            if (category && category.sectionDisabled == 127) {
                if (product.pDisplay == 1) turnedOffCat++
                product.pDisplay = 0
            }
        });
        console.log(turnedOffCat, "products in disabled categories")


        // ============================Skipping Products============================
        for (const product of productsWithOptions) {
            product.options = []

            // Skip if no options
            if (product.Option_Group_IDs == "") continue
            console.log("Options", product.pID)

            // Skip Products with Mulitple Options
            if (product.Option_Group_IDs.split(',')[1]) { console.log('Extra Groups') }

            // Match Option Group from optionGroups
            const optionID = product.Option_Group_IDs.split(',')[0]
            const optionGroup = optionGroups.find(optionGroup => optionGroup.optGrpID == optionID)

            // Skip If No Option_Group_IDs Match
            if (!optionGroup) { console.log("Missing Option Group"); continue }

            // Load Options Group Text into Products
            product.optionGroup = optionGroup.optGrpName

            // Skip Products with Upgrades (AMG250)
            // if (optionGroup.forceSelection == -2) { console.log("Upgrades"); continue }
            if (optionGroup.optType == -2) { console.log("Upgrades") }

            console.log("Fin", product.pID)

            // Load Options into Products => product.options loaded with website options
            options.forEach(option => {
                if (option.optGroup == optionGroup.optGrpID) {
                    const newOption = {
                        oName: option.optName,
                        oPrice: option.optPriceDiff + product.pPrice
                    }
                    product.options.push(newOption)
                }
            })
        }

        // ==========================Match and Load Clover ID==========================
        for (const product of productsWithOptions) {
            if (product.options.length) {
                // Match Children with Parents
                product.pPrice = null
                product.pListPrice = null
                product.suggestions = []
                matchChildren(product, cloverInv)
            } else {
                // Match Solos
                if (product.pDisplay == 0) continue
                if (product.pListPrice == 0) product.pListPrice = null
                let clover = cloverInv.find(clover => clover.SKU == product.pID)
                if (clover) {
                    product.cloverID = clover["Clover ID"]
                }
            }
        }

        return productsWithOptions

    } catch (error) {
        console.error(`${error.message}`.red.inverse)
        process.exit(1)
    }
}



const seedProducts = async (productsLoaded, images, productsNoOptions) => {
    try { // Load Products
        // Delete Products with Don't Sell and Don't Display
        const products = productsLoaded.filter(prod => prod.pDisplay == 1 || prod.pSell == 1)

        // Pick Description
        products.forEach(product => {
            product.pDescription = product.pLongDescription || product.pDescription
        });

        // Load Images
        products.forEach(product => { product.images = [] });
        for (let i = 0; i < images.length; i++) {
            const { imageProduct, imageSrc, imageType, imageNumber } = images[i];
            const productIndex = products.findIndex(product => product.pID == imageProduct)
            if (productIndex != -1) {
                products[productIndex].images.push({
                    imageProduct,
                    imageSrc,
                    imageType,
                    imageNumber,
                })
            }
        }

        // Load Brands 
        for (const product of products) {
            for (const pno of productsNoOptions) {
                if (product.pID == pno.pID) product.pManufacturer = pno.pManufacturer
            }
        }

        await Product.deleteMany()
        // await Product.insertMany(products)
        await Product.insertMany(products.filter(product => product.pDisplay != 0))
        console.log("Products Imported!")
        process.exit()


    } catch (error) {
        console.error(`${error.message}`.red.inverse)
        process.exit(1)
    }
}

const seedInventory = async (cloverInv) => {
    try { // Load Clover Inventory
        let inventory = []
        cloverInv.forEach(clover => {
            if (clover.Name) {
                inventory.push({
                    cloverID: clover['Clover ID'],
                    cloverName: clover.Name,
                    cloverPrice: Math.round(Number(clover.Price) * 100),
                    cloverSku: clover.SKU,
                    iStock: Number(clover.Quantity),
                    iSell: 1,
                })
            }
        })
        await Inventory.deleteMany()
        await Inventory.insertMany(inventory)
        console.log("Inventory Imported!")
        process.exit()

    } catch (error) {
        console.error(`${error.message}`.red.inverse)
        process.exit(1)
    }
}

const seedCategories = async (categories) => {
    try {
        console.log("Importing Categories")
        categories.forEach(category => {
            if (category.sectionDisabled == 127) category.sectionDisabled = true
        });
        await Category.deleteMany()
        await Category.insertMany(categories)
        console.log("Categories Imported!")

    } catch (error) {
        console.error(`${error.message}`.red.inverse)
        process.exit(1)
    }
}




const main = async () => {
    try {
        dotenv.config()
        await connectDB()

        const productsNoOptions = await csvtojson().fromFile('./backend/data/inventory 11-5-2022.csv')
        const productsWithOptions = await csvtojson().fromFile('./backend/data/productdata 11-5-2022.csv')
        const options = await csvtojson().fromFile('./backend/data/optiondata 11-5-2022.csv')
        const optionGroups = await csvtojson().fromFile('./backend/data/optiongroupdata 11-5-2022.csv')
        const images = await csvtojson().fromFile('./backend/data/productimages 11-5-2022.csv')
        const categories = await csvtojson().fromFile('./backend/data/categoryinventory 11-5-2022.csv')
        const cloverInv = XlsxDataAsJson.parseFile("./backend/data/clover inventory 11-6-2022.xlsx").filter(row => row['Clover ID']);

        //ManualFix
        cloverInv.forEach(clover => { if (!clover.SKU) clover.SKU = clover['Product Code'] })

        // Price to Cents
        productsWithOptions.forEach(product => { product.pPrice = Math.round(Number(product.pPrice) * 100) })
        productsWithOptions.forEach(product => { product.pListPrice = Math.round(Number(product.pListPrice) * 100) })
        options.forEach(option => { option.optPriceDiff = Math.round(Number(option.optPriceDiff) * 100) })

        // const productsLoaded = await matchProducts(productsWithOptions, cloverInv, options, optionGroups, categories)
        // await seedProducts(productsLoaded, images, productsWithOptions)
        // await seedInventory(cloverInv)
        // await seedCategories(categories)

        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
main()

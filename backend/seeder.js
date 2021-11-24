import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'

import users from './data/users.js'
import products from './data/products.js'
import categories from './data/categories.js'
import images from './data/images.js'
import cloverInv from './data/cloverInv.js'
import options from './data/options.js'
import optionGroups from './data/optionGroups.js'
import productsWithOptions from './data/productsWithOptions.js'
import brands from './data/brands.js'
import discounts from './data/discounts.js'

import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import Category from './models/categoryModel.js'
import Brands from './models/brandModel.js'
import Discounts from './models/discountModel.js'
import Carts from './models/cartModel.js'

import connectDB from './config/db.js'

dotenv.config()
connectDB()

const importData = async () => {
    try {

        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()
        await Category.deleteMany()
        await Brands.deleteMany()
        await Discounts.deleteMany()
        await Carts.deleteMany()

        await User.insertMany(users)
        await Brands.insertMany(brands)
        await Discounts.insertMany(discounts)

        categories.forEach(category => {
            if (category.sectionDisabled == 127) category.sectionDisabled = true
        });
        await Category.insertMany(categories)

        // Label Manufacturers
        // for (let i = 0; i < products.length; i++) {
        //     const product = products[i];

        // }

        // Pick Description
        products.forEach(product => {
            product.pDescription = product.pLongDescription || product.pDescription
        });

        //Load Images
        products.forEach(product => {
            product.images = []
        });
        for (let i = 0; i < images.length; i++) {
            const { imageProduct, imageSrc, imageType, imageNumber } = images[i];
            const productIndex = products.findIndex(product => product.pID == imageProduct)
            if (productIndex != -1) {
                const newImage = {
                    imageProduct,
                    imageSrc,
                    imageType,
                    imageNumber,
                }
                products[productIndex].images.push(newImage)
            }
        }

        //Load Options
        // products.forEach(product => {
        //     product.options = []
        // });
        // for (let i = 0; i < productOptions.length; i++) {
        //     const productOption = productOptions[i]
        //     const productIndex = products.findIndex(product => product.pID == productOption.pID)
        //     // If pID Match
        //     if (productIndex != -1) {
        //         const optionGroupID = productOption.Option_Group_IDs.split(',')[0]
        //         const optionGroupIndex = optionGroups.findIndex(optionGroup => optionGroup.optGrpID == optionGroupID)
        //         // If Option_Group_IDs Match
        //         if (optionGroupIndex != -1) {
        //             const optionGroupText = optionGroups[optionGroupIndex].optGrpName
        //             products[productIndex].optionGroup = optionGroupText
        //             options.forEach(option => {
        //                 if (option.optGroup == optionGroupID) {
        //                     const newOption = {
        //                         optName: option.optName,
        //                         priceDiff: (Number(option.optPriceDiff) * 100)
        //                     }
        //                     products[productIndex].options.push(newOption)
        //                     // console.log("pushed", products[productIndex].pID)
        //                 }
        //             })
        //         }
        //     }
        // }

        // Price to Cents
        cloverInv.forEach(inv => { inv.Price = Math.round(Number(inv.Price) * 100) })
        products.forEach(product => { product.pPrice = Math.round(Number(product.pPrice) * 100) })
        products.forEach(product => { product.pListPrice = Math.round(Number(product.pListPrice) * 100) })
        options.forEach(option => { option.optPriceDiff = Math.round(Number(option.optPriceDiff) * 100) })

        // Disable Products in productsWithOptions from products
        let turnedOff = 0
        products.forEach(product => {
            if (product.pDisplay == 0) {
                let p2 = productsWithOptions.find(p2 => p2.pID == product.pID)
                if (p2.pDisplay == 1) turnedOff++
                p2.pDisplay = 0
            }
        });
        // console.log(turnedOff, "products in disabled in ProductsWithOptions from Product")


        // Disable Products in Disabled Categories 
        let turnedOffCat = 0
        products.forEach(product => {
            let category = categories.find(category => category.sectionID == product.pSection)
            if (category && category.sectionDisabled == 127) {
                if (product.pDisplay == 1) turnedOff++
                product.pDisplay = 0
                let p2 = productsWithOptions.find(p2 => p2.pID == product.pID)
                p2.pDisplay = 0
            }
        });
        // console.log(turnedOffCat, "products in disabled categories")

        //Load Options
        products.forEach(product => {
            product.options = []
        });
        cloverInv.forEach(clover => {
            clover.iParent = ""
            clover.iSelectionName = ""
        });
        for (let i = 0; i < productsWithOptions.length; i++) {
            const productOption = productsWithOptions[i]
            const productIndex = products.findIndex(product => product.pID == productOption.pID)
            // If pID Match
            if (productIndex != -1) {

                // Skip Products not Displayed
                if (productOption.pDisplay == 0) continue

                // Skip Products with Mulitple Options
                const extra = productOption.Option_Group_IDs.split(',')[1]
                if (extra) {
                    // extraOptions++
                    continue
                }

                // Match Option Group from optionGroups
                const optionGroupID = productOption.Option_Group_IDs.split(',')[0]
                const optionGroupIndex = optionGroups.findIndex(optionGroup => optionGroup.optGrpID == optionGroupID)
                // If Option_Group_IDs Match
                if (optionGroupIndex != -1) {

                    // Skip Products with Upgrades (AV-TT)
                    if (optionGroups[optionGroupIndex].forceSelection == -2) {
                        // upgrades++
                        continue
                    }

                    // Load Options Group Text into Products
                    const optionGroupText = optionGroups[optionGroupIndex].optGrpName
                    products[productIndex].optionGroup = optionGroupText

                    // Load Options into Products
                    options.forEach(option => {
                        if (option.optGroup == optionGroupID) {
                            const newOption = {
                                optName: option.optName,
                                priceDiff: option.optPriceDiff
                            }
                            products[productIndex].options.push(newOption)
                            // countOptions++
                            // console.log("pushed", products[productIndex].pID)
                        }
                    })
                    // if (products[productIndex].options.length == 1) console.log(products[productIndex].pID)  // Parents with Only One Option
                }
            }
        }

        // Count Clover ID
        let count = 0
        let countOptions = 0
        // Fill Details
        var fullProducts = []
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            product.pPrice = 0;
            product.pListPrice = 0;
            // product.pPrice = Math.round(product.pPrice * 100);
            // product.pListPrice = Math.round(product.pListPrice * 100);
            // product.pInStock = 100
            // product.pWeight = 2000 //2.000 lbs
            // product.pLength = 10 // 10 inches
            // product.pWidth = 10
            // product.pHeight = 10
            // product.user = adminUser
            if (product.options.length > 0) {
                // product.cloverID = product.pID
                fullProducts.push(product)
                countOptions++
            }
            else {
                for (const clover of cloverInv) {
                    if (clover.SKU === product.pID) { // And not Null
                        // product.cloverID = clover["Clover ID"]
                        fullProducts.push(product)
                        count++
                        break
                    }
                }
            }
        }
        console.log(count + " products loaded with Clover ID")
        console.log(countOptions + " products loaded with Options")

        await Product.insertMany(fullProducts)


        console.log("Data Imported!".green.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error.message}`.red.inverse)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()
        await Category.deleteMany()

        console.log("Data Destroyed!".red.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error.message}`.red.inverse)
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}


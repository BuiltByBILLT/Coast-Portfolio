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
import productOptions from './data/productOptions.js'

import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import Category from './models/categoryModel.js'
import connectDB from './config/db.js'

dotenv.config()
connectDB()

const importData = async () => {
    try {

        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()
        await Category.deleteMany()


        categories.push({
            "sectionID": 999,
            "sectionName": "Newly Added",
            "sectionWorkingName": "Newly Added",
            "sectionImage": "images/sample.jpg",
            "topSection": 0,
            "sectionOrder": 999,
            "rootSection": 1,
            "sectionDisabled": 0,
            "sectionURL": "",
            "sectionDescription": "See What's New!"
        })
        await Category.insertMany(categories)

        // Add Admin as Product's Owner
        const createdUsers = await User.insertMany(users)
        const adminUser = createdUsers[0]._id

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
        products.forEach(product => {
            product.options = []
        });
        for (let i = 0; i < productOptions.length; i++) {
            const productOption = productOptions[i]
            const productIndex = products.findIndex(product => product.pID == productOption.pID)
            // If pID Match
            if (productIndex != -1) {
                const optionGroupID = productOption.Option_Group_IDs.split(',')[0]
                const optionGroupIndex = optionGroups.findIndex(optionGroup => optionGroup.optGrpID == optionGroupID)
                // If Option_Group_IDs Match
                if (optionGroupIndex != -1) {
                    const optionGroupText = optionGroups[optionGroupIndex].optGrpName
                    products[productIndex].optionGroup = optionGroupText
                    options.forEach(option => {
                        if (option.optGroup == optionGroupID) {
                            const newOption = {
                                optName: option.optName,
                                priceDiff: (Number(option.optPriceDiff) * 100)
                            }
                            products[productIndex].options.push(newOption)
                            // console.log("pushed", products[productIndex].pID)
                        }
                    }
                    )
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
            product.pPrice = Math.round(product.pPrice * 100);
            product.pListPrice = Math.round(product.pListPrice * 100);
            product.pInStock = 100
            product.pWeight = 2000 //2.000 lbs
            product.pLength = 10 // 10 inches
            product.pWidth = 10
            product.pHeight = 10
            product.user = adminUser
            if (product.options.length > 0) {
                product.cloverID = product.pID
                fullProducts.push(product)
                countOptions++
            }
            else {
                for (const clover of cloverInv) {
                    if (clover.SKU === product.pID) { // And not Null
                        product.cloverID = clover["Clover ID"]
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


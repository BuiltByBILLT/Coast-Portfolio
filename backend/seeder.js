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

        // Label Manufacturers
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            if (product.pManufacturer == "57") product.pManufacturer = "Advantage Refinish Products"
            if (product.pManufacturer == "68") product.pManufacturer = "Air Gunsa"
            if (product.pManufacturer == "73") product.pManufacturer = "Airbrush Action"
            if (product.pManufacturer == "56") product.pManufacturer = "Alpha 6"
            if (product.pManufacturer == "4") product.pManufacturer = "Aqua Flow"
            if (product.pManufacturer == "64") product.pManufacturer = "Artograph"
            if (product.pManufacturer == "66") product.pManufacturer = "Artool"
            if (product.pManufacturer == "27") product.pManufacturer = "Auto Air"
            if (product.pManufacturer == "61") product.pManufacturer = "Auto Air candy2O"
            if (product.pManufacturer == "46") product.pManufacturer = "Auto Borne"
            if (product.pManufacturer == "31") product.pManufacturer = "Aztek"
            if (product.pManufacturer == "14") product.pManufacturer = "Badger"
            if (product.pManufacturer == "12") product.pManufacturer = "California Air Tools"
            if (product.pManufacturer == "1") product.pManufacturer = "Coast Airbrush"
            if (product.pManufacturer == "45") product.pManufacturer = "Comart"
            if (product.pManufacturer == "3") product.pManufacturer = "Createx"
            if (product.pManufacturer == "48") product.pManufacturer = "Createx Colors Illustration Colors"
            if (product.pManufacturer == "15") product.pManufacturer = "DeVilbiss"
            if (product.pManufacturer == "11") product.pManufacturer = "DH Woodworks"
            if (product.pManufacturer == "77") product.pManufacturer = "Dry Air Systems"
            if (product.pManufacturer == "70") product.pManufacturer = "Dura-Block"
            if (product.pManufacturer == "9") product.pManufacturer = "EBA"
            if (product.pManufacturer == "36") product.pManufacturer = "Excel"
            if (product.pManufacturer == "21") product.pManufacturer = "FBS Tapes & Sprayers"
            if (product.pManufacturer == "81") product.pManufacturer = "Flake King"
            if (product.pManufacturer == "58") product.pManufacturer = "Freak Flex"
            if (product.pManufacturer == "59") product.pManufacturer = "Graftobian"
            if (product.pManufacturer == "43") product.pManufacturer = "Grex"
            if (product.pManufacturer == "26") product.pManufacturer = "HB Bodyworks"
            if (product.pManufacturer == "51") product.pManufacturer = "Holbein Aeroflash"
            if (product.pManufacturer == "7") product.pManufacturer = "House of Kolor"
            if (product.pManufacturer == "49") product.pManufacturer = "House of Kolor Aerosols"
            if (product.pManufacturer == "50") product.pManufacturer = "House of Kolor Shimrin 2"
            if (product.pManufacturer == "2") product.pManufacturer = "Iwata Medea"
            if (product.pManufacturer == "42") product.pManufacturer = "JAtech"
            if (product.pManufacturer == "65") product.pManufacturer = "KopyKake"
            if (product.pManufacturer == "29") product.pManufacturer = "La D'ore"
            if (product.pManufacturer == "41") product.pManufacturer = "Lil Daddy Roth Flake"
            if (product.pManufacturer == "67") product.pManufacturer = "LumaIII"
            if (product.pManufacturer == "33") product.pManufacturer = "Lumilor"
            if (product.pManufacturer == "10") product.pManufacturer = "Mack"
            if (product.pManufacturer == "74") product.pManufacturer = "Mad Fabricators"
            if (product.pManufacturer == "52") product.pManufacturer = "Medea Textile acrylic"
            if (product.pManufacturer == "76") product.pManufacturer = "Meguiar's"
            if (product.pManufacturer == "6") product.pManufacturer = "Old School Flake"
            if (product.pManufacturer == "5") product.pManufacturer = "One Shot"
            if (product.pManufacturer == "13") product.pManufacturer = "Paasche"
            if (product.pManufacturer == "71") product.pManufacturer = "Preval"
            if (product.pManufacturer == "60") product.pManufacturer = "Pro Aiir Body Paints"
            if (product.pManufacturer == "16") product.pManufacturer = "Sata"
            if (product.pManufacturer == "35") product.pManufacturer = "Sharpen Air"
            if (product.pManufacturer == "17") product.pManufacturer = "Silentaire"
            if (product.pManufacturer == "55") product.pManufacturer = "Spray Max"
            if (product.pManufacturer == "32") product.pManufacturer = "System 51"
            if (product.pManufacturer == "40") product.pManufacturer = "Tamiya"
            if (product.pManufacturer == "8") product.pManufacturer = "Temptu"
            if (product.pManufacturer == "78") product.pManufacturer = "Trulers"
            if (product.pManufacturer == "44") product.pManufacturer = "Vintage Flatz"
            if (product.pManufacturer == "34") product.pManufacturer = "Virtus"
            if (product.pManufacturer == "82") product.pManufacturer = "VsionAir"
            if (product.pManufacturer == "28") product.pManufacturer = "Wicked"
            if (product.pManufacturer == "54") product.pManufacturer = "Xtreme"
        }

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


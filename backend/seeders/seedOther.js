import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'

import users from '../data/users.js'
// import categories from '../data/categories.js'
import brands from '../data/brands.js'
import discounts from '../data/discounts.js'

import User from '../models/userModel.js'
import Category from '../models/categoryModel.js'
import Brands from '../models/brandModel.js'
import Discounts from '../models/discountModel.js'
import Carts from '../models/cartModel.js'
// import Order from '../models/orderModel.js'

import connectDB from '../config/db.js'

dotenv.config()
connectDB()

const importData = async () => {
    try {

        // await Order.deleteMany()
        await User.deleteMany()
        await Brands.deleteMany()
        await Discounts.deleteMany()
        await Carts.deleteMany()

        await User.insertMany(users)
        await Brands.insertMany(brands)
        await Discounts.insertMany(discounts)

        console.log("Data Imported!".green.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error.message}`.red.inverse)
        process.exit(1)
    }
}

importData()


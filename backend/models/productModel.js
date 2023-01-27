import mongoose from 'mongoose'
import Inventory from './inventoryModel.js'

const imageSchema = mongoose.Schema({
    imageProduct: {
        type: String,
        required: true,
    },
    imageSrc: {
        type: String,
        required: true,
        default: "/static/sample.jpg"
    },
    imageType: {
        type: Number,
        required: true,
        default: 0,
    },
    imageNumber: {
        type: Number,
        required: true,
        // unique: true,
    },

}, {
    timestamps: true,
})


const optionSchema = mongoose.Schema({
    oName: {
        type: String,
        required: true,
    },
    oPrice: {
        type: Number,
        required: true,
    },
    oListPrice: {
        type: Number,
        default: null
    },
    cloverID: {
        type: String,
    },
    oStock: {
        type: Number,
        default: null
    }
}, {
    timestamps: true,
})



const productSchema = mongoose.Schema({
    pID: {
        type: String,
        unique: true,
        required: true
    },
    pName: {
        type: String,
        required: true
    },
    pManufacturer: {
        type: Number,
    },
    pSection: {
        type: Number,
        required: true,
    },
    pPrice: {
        type: Number,
    },
    pListPrice: {
        type: Number,
    },
    pDescription: {
        type: String,
    },
    pDisplay: {
        type: Boolean,
        required: true,
        default: 0
    },
    images: [imageSchema],
    options: [optionSchema],
    optionGroup: {
        type: String,
        default: null,
    },
    cloverID: {
        type: String,
    },
    pStock: {
        type: Number,
        default: null
    }

}, {
    timestamps: true
})



// // productSchema.pre('find')
// productSchema.pre('findOne', async function (next) {
//     if (this) {
//         next()
//     }
//     this.pPrice = 1111
//     this.pListPrice = 2222
//     console.log(this.pPrice)

// })



const Product = mongoose.model('Product', productSchema)
export default Product

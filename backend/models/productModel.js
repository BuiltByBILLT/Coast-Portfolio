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
        default: "/images/sample.jpg"
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
    images: [imageSchema],
    optionGroup: {
        type: String,
    },
    pManufacturer: {
        type: String,
    },
    pSection: {
        type: Number,
        required: true,
    },
    pSectionName: {
        type: String,
        // required: true,
    },
    pDescription: {
        type: String,
    },
    pLongDescription: {
        type: String,
    },
    pPrice: {
        type: Number,
        // required: true,
        default: 0
    },
    pListPrice: {
        type: Number,
        default: 0
    },
    pDisplay: {
        type: Boolean,
        required: true,
        default: 0
    },
    pSell: {
        type: Boolean,
        required: true,
        default: 0
    },

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

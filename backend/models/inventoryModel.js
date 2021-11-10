import mongoose from 'mongoose'

const inventorySchema = mongoose.Schema({
    cloverID: {
        type: String,
        unique: true,
        required: true
    },
    cloverName: {
        type: String,
        required: true
    },
    iParent: {
        type: String,
    },
    iSelectionName: {
        type: String,
    },
    iPrice: {
        type: Number,
        // required: true,
        default: 0
    },
    iListPrice: {
        type: Number,
        // required: true,
        // default: 0
    },
    iStock: {
        type: Number,
        // required: true,
        default: 0
    },
    iDisplay: {
        type: Boolean,
        // required: true,
        default: 0
    },
    iSell: {
        type: Boolean,
        // required: true,
        default: 0
    },

}, { timestamps: true })


const Inventory = mongoose.model('Inventory', inventorySchema)

export default Inventory

// const optionsSchema = mongoose.Schema({
//     optName: {
//         type: String,
//         required: true,
//     },
//     priceDiff: {
//         type: Number,
//         required: true,
//         default: 0,
//     },
//     weightDiff: {
//         type: Number,
//         required: true,
//         default: 0,
//     },
//     optThumb: {
//         type: String,
//     },
//     optImageLarge: {
//         type: String,
//     },
//     optStock: {
//         type: Number,
//         required: true,
//         default: 0,
//     },
//     cloverID: {
//         type: String,
//         required: true,
//     },


// }, {
//     timestamps: true,
// })
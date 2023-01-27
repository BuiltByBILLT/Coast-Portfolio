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
    cloverSku: {
        type: String,
    },
    cloverPrice: {
        type: Number,
        required: true
    },
    iStock: {
        type: Number,
        default: 0
    },
    iSell: {
        type: Boolean,
        default: 0
    },

}, { timestamps: true })


const Inventory = mongoose.model('Inventory', inventorySchema)

export default Inventory
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
        default: 0
    },
    iListPrice: {
        type: Number,
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
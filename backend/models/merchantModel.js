import mongoose from 'mongoose'

const merchantItemsSchema = mongoose.Schema({
    sku: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    cloverID: {
        type: String,
        required: false
    },
}, {
    timestamps: true,
})

const merchantSchema = mongoose.Schema({
    merchantName: {
        type: String,
        required: true
    },
    merchantEmail: {
        type: String,
    },
    merchantAddress: {
        type: String,
    },
    replyToEmail: {
        type: String,
    },
    shipToAddress: {
        type: String,
    },
    merchantItems: [merchantItemsSchema]
}, {
    timestamps: true,
})

const Merchant = mongoose.model('Merchant', merchantSchema)

export default Merchant
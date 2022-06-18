import mongoose from 'mongoose'

const lineSchema = mongoose.Schema({
    cloverID: {
        type: String,
    },
    sku: {
        type: String,
    },
    description: {
        type: String,
    },
    qty: {
        type: Number,
    },
    price: {
        type: Number,
    },
})

const PoSchema = mongoose.Schema({
    merchantName: {
        type: String,
        required: true
    },
    merchantEmail: {
        type: String,
        required: true
    },
    merchantAddress: {
        type: String,
        required: true
    },
    replyToEmail: {
        type: String,
        required: true
    },
    shipToAddress: {
        type: String,
        required: true
    },
    poDate: {
        type: String,
        required: true
    },
    receivedDate: {
        type: String,
    },
    emailHtml: {
        type: String,
        required: true
    },
    emailURL: {
        type: String,
    },
    status: {
        type: String,
    },
    lineItems: [lineSchema],


}, { timestamps: true })


const Po = mongoose.model('Po', PoSchema)

export default Po
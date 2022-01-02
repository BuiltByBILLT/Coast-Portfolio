import mongoose from 'mongoose'

const ZapSchema = mongoose.Schema({
    orderID: { type: String },
    subtotal: { type: Number },
    shipping: { type: Number },
    tax: { type: Number },
    zapID: { type: String },
    requestID: { type: String },
    attempt: { type: String },
    status: { type: String },

}, { timestamps: true })

const Zap = mongoose.model('Zap', ZapSchema)

export default Zap
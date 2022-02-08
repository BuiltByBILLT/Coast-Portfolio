import mongoose from 'mongoose'

const lineSchema = mongoose.Schema({
    lineCloverID: {
        type: String,
    },
    lineSku: {
        type: String,
    },
    lineName: {
        type: String,
    },
    lineQty: {
        type: Number,
    },
    lineRate: {
        type: Number,
    },
})

const PoSchema = mongoose.Schema({
    poEmail: {
        type: String,
        required: true
    },
    poVender: {
        type: String,
        required: true
    },
    poShipTo: {
        type: String,
        required: true
    },
    poText: {
        type: String,
    },
    poHtml: {
        type: String,
        required: true
    },
    poLines: [lineSchema],


}, { timestamps: true })


const Po = mongoose.model('Po', PoSchema)

export default Po
import mongoose from 'mongoose'

const discountSchema = mongoose.Schema({
    discountCode: {
        type: String,
        unique: true,
        required: true
    },
    discountDescription: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        enum: ["PERCENT", "FLAT"],
        required: true
    },
    discountAmount: {
        type: Number,
        required: true
    },
    discountLive: {
        type: Boolean,
        default: false
    },
    discountExclude: {
        type: String,
    },

}, { timestamps: true })


const Discount = mongoose.model('Discount', discountSchema)

export default Discount
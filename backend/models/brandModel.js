import mongoose from 'mongoose'

const BrandSchema = mongoose.Schema({
    brandID: {
        type: Number,
        unique: true,
        required: true
    },
    brandName: {
        type: String,
        required: true
    },

}, { timestamps: true })


const Brand = mongoose.model('Brand', BrandSchema)

export default Brand
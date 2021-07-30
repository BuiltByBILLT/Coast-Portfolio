import mongoose from 'mongoose'
const categorySchema = mongoose.Schema({

    sectionID: {
        type: Number,
        required: true,
        unique: true
    },
    sectionName: {
        type: String,
    },
    sectionWorkingName: {
        type: String,
        required: true,
        unique: false,
    },
    sectionImage: {
        type: String,
        default: '/images/sample.jpg'
    },
    topSection: {
        type: Number,
        required: true,
    },
    sectionOrder: {
        type: Number,
        required: true,
    },
    rootSection: {
        type: Boolean,
        required: true,
    },
    sectionDisabled: {
        type: Number,
        required: true,
    },
    sectionURL: {
        type: String,
    },
    sectionDescription: {
        type: String,
    },
}, {
    timestamps: true
})

const Category = mongoose.model('Category', categorySchema)

export default Category
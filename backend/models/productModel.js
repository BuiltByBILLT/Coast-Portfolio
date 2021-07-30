import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

}, {
    timestamps: true,
})

const imageSchema = mongoose.Schema({
    imageProduct: {
        type: String,
        required: true,
    },
    imageSrc: {
        type: String,
        required: true,
        default: "/images/sample.jpg"
    },
    imageType: {
        type: Number,
        required: true,
        default: 0,
    },
    imageNumber: {
        type: Number,
        required: true,
        unique: true,
    },

}, {
    timestamps: true,
})


const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    pID: {
        type: String,
        unique: true,
        required: true
    },
    pName: {
        type: String,
        required: true
    },
    images: [imageSchema],
    pManufacturer: {
        type: String,
    },
    pSection: {
        type: Number,
        required: true,
    },
    pDescription: {
        type: String,
    },
    dLongDescription: {
        type: String,
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    pPrice: {
        type: Number,
        required: true,
        default: 0
    },
    pListPrice: {
        type: Number,
    },
    pInStock: {
        type: Number,
        required: true,
        default: 0
    },
    pWeight: {
        type: Number,
        required: true,
        default: 0
    },
    pDisplay: {
        type: Boolean,
        required: true,
        default: 0
    },
    pSell: {
        type: Boolean,
        required: true,
        default: 0
    },
    topSection: {
        type: String
    }

}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)

export default Product
// import mongoose from 'mongoose'

// const imageSchema = mongoose.Schema({
//     imageProduct: {
//         type: String,
//         required: true,
//     },
//     imageSrc: {
//         type: String,
//         required: true,
//         default: "/images/sample.jpg"
//     },
//     imageType: {
//         type: Number,
//         required: true,
//         default: 0,
//     },
//     imageNumber: {
//         type: Number,
//         required: true,
//         // unique: true,
//     },

// }, {
//     timestamps: true,
// })

// const optionsSchema = mongoose.Schema({
//     optName: {
//         type: String,
//         required: true,
//     },
//     priceDiff: {
//         type: Number,
//         required: true,
//         default: 0,
//     },
//     weightDiff: {
//         type: Number,
//         required: true,
//         default: 0,
//     },
//     optThumb: {
//         type: String,
//     },
//     optImageLarge: {
//         type: String,
//     },
//     optStock: {
//         type: Number,
//         required: true,
//         default: 0,
//     },
//     cloverID: {
//         type: String,
//         required: true,
//     },


// }, {
//     timestamps: true,
// })


// const productSchema = mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User'
//     },
//     pID: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     pName: {
//         type: String,
//         required: true
//     },
//     images: [imageSchema],
//     options: [optionsSchema],
//     optionGroup: {
//         type: String,
//     },
//     pManufacturer: {
//         type: String,
//     },
//     pSection: {
//         type: Number,
//         required: true,
//     },
//     pDescription: {
//         type: String,
//     },
//     pLongDescription: {
//         type: String,
//     },
//     // reviews: [reviewSchema],
//     // rating: {
//     //     type: Number,
//     //     required: true,
//     //     default: 0
//     // },
//     // numReviews: {
//     //     type: Number,
//     //     required: true,
//     //     default: 0
//     // },
//     pPrice: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     pListPrice: {
//         type: Number,
//     },
//     pInStock: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     pWeight: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     pLength: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     pWidth: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     pHeight: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     pDisplay: {
//         type: Boolean,
//         required: true,
//         default: 0
//     },
//     pSell: {
//         type: Boolean,
//         required: true,
//         default: 0
//     },
//     topSection: {
//         type: String
//     },
//     cloverID: {
//         type: String,
//         unique: true,
//         required: true,
//     }

// }, {
//     timestamps: true
// })

// const Product = mongoose.model('Product', productSchema)

// export default Product

// // const reviewSchema = mongoose.Schema({
// //     name: {
// //         type: String,
// //         required: true,
// //     },
// //     rating: {
// //         type: Number,
// //         required: true,
// //     },
// //     comment: {
// //         type: String,
// //         required: true,
// //     },
// //     user: {
// //         type: mongoose.Schema.Types.ObjectId,
// //         required: true,
// //         ref: 'User'
// //     },

// // }, {
// //     timestamps: true,
// // })
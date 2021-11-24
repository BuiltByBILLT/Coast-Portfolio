import mongoose from 'mongoose'

const cartItemsSchema = mongoose.Schema({
    pID: {
        type: String,
        required: true
    },
    cloverID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: { type: String },
    price: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
})

const cartSchema = mongoose.Schema({
    cartItems: [cartItemsSchema]
}, {
    timestamps: true,
})

const Cart = mongoose.model('Cart', cartSchema)

export default Cart
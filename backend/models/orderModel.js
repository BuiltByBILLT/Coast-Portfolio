import mongoose from 'mongoose'

const orderSchema = mongoose.Schema({
    orderID: { type: String },
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

export default Order
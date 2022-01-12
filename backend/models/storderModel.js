import mongoose from 'mongoose'

const storderSchema = mongoose.Schema({
    orderID: { type: String },
}, {
    timestamps: true
})

const Storder = mongoose.model('Storder', storderSchema)

export default Storder
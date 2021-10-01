import mongoose from 'mongoose'

const labelSchema = mongoose.Schema({
    orderID: {
        type: String,
        required: true,
        unique: true,
    },
    tracking: {
        type: String,
        required: true,
    },
    raw: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const Label = mongoose.model('Label', labelSchema)

export default Label
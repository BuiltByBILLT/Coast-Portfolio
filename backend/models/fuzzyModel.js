import mongoose from 'mongoose'


const fuzzySchema = mongoose.Schema({
    pID: {
        type: String,
        required: true,
        // unique: true
    },
    oName: {
        type: String,
    },
    oPrice: {
        type: Number,
    },
    suggestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }],

}, { timestamps: true })


const Fuzzy = mongoose.model('Fuzzy', fuzzySchema)

export default Fuzzy
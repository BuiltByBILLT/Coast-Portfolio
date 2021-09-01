import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

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
    countInStock: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    pWeight: {
        type: Number,
        required: true,
        default: 0
    },
    pLength: {
        type: Number,
        required: true,
        default: 0
    },
    pWidth: {
        type: Number,
        required: true,
        default: 0
    },
    pHeight: {
        type: Number,
        required: true,
        default: 0
    },

}, {
    timestamps: true,
})

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isStaff: {
        type: Boolean,
        required: true,
        default: false
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    customerID: {
        type: String,
        unique: true,
        sparse: true,

    },
    employeeID: {
        type: String,
        unique: true,
        sparse: true,
    },
    cart: [cartItemsSchema],
}, {
    timestamps: true
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User
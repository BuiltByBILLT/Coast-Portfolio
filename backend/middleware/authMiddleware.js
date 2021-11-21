import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const check = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id).select('-password')
        if (req.user) {
            if (req.user.isStaff) console.log("Staff")
            else console.log("Customer")
        } else console.log('Invalid Token')
    }
    else console.log('No User')
    next()
})

const protect = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('-password')
            console.log("User:", req.user.id)

            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not Authorized, Token Failed')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('No Token')
    }

})

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as Admin')
    }
}

const staff = (req, res, next) => {
    if (req.user && req.user.isStaff) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as Staff')
    }
}


export { check, protect, admin, staff }
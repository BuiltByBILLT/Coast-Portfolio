import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import Cart from '../models/cartModel.js'
import axios from 'axios'

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email: email })

    if (user && await user.matchPassword(password)) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isStaff: user.isStaff,
            isAdmin: user.isAdmin,
            cart: user.cart,
            wishList: user.wishList,
            customerID: user.customerID,
            employeeID: user.employeeID,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})


// @desc Get user profile (From Admin?)
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            customerID: user.customerID,
            employeeID: user.employeeID,
            isStaff: user.isStaff,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})


// @desc Get all users  
// @route GET /api/users/
// @access Private/Staff/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).sort({ createdAt: -1 })

    res.json(users)
})

// @desc Get user by ID  
// @route GET /api/users/:id
// @access Private/Staff/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

//========================================================================================================================
//===============================================Edit=====================================================================
//========================================================================================================================

// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email: email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    const { data } = await syncToClover({ name: "", email: "", customerID: "" }, req.body)

    const user = await User.create({
        name,
        email,
        password,
        customerID: data.id
        // customerID: name + email
    })

    if (user) {

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            customerID: user.customerID,
            isAdmin: false,
            token: generateToken(user._id),
            cart: user.cart
        })
    } else {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})


// @desc User Updates own profile 
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    console.log(req.body)
    const user = await User.findById(req.user._id)
    const oldUser = { ...user }

    if (user) {

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()
        await syncToClover(user, req.body)

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isStaff: updatedUser.isStaff,
            isAdmin: updatedUser.isAdmin,
            customerID: updatedUser.customerID,
            token: generateToken(updatedUser._id),
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})


// @desc Admin Updates User 
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {


        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if (req.user && req.user.isAdmin) {
            user.isStaff = req.body.isStaff || req.body.isAdmin
            user.isAdmin = req.body.isAdmin
        }

        const updatedUser = await user.save()
        await syncToClover(user, req.body)

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isStaff: updatedUser.isStaff,
            customerID: updatedUser.customerID,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})



// Middle Function to sync to Clover
const syncToClover = async (user, newUser) => {
    console.log(user)
    let cloverResponse = {}
    let cloverPost = {}
    // console.log(user)
    // console.log(newUser)

    if (newUser.name && (newUser.name != user.name)) {
        const nameArr = newUser.name.split(" ")
        const first = nameArr[0]
        const last = nameArr.length > 1 ? nameArr[nameArr.length - 1] : null
        cloverPost.firstName = first
        cloverPost.lastName = last
    }
    if (newUser.email && (newUser.email != user.email)) {
        cloverPost.emailAddresses = [{ "emailAddress": newUser.email.toLowerCase() }]
    }
    // console.log(cloverPost)
    console.log(user.customerID)
    try {
        cloverResponse = await axios.post(
            process.env.CLOVER_URL + `/customers/${user.customerID}`,
            cloverPost,
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } })

    } catch {
        console.log(cloverResponse.data)
    }
    return cloverResponse
}


// @desc Delete users  
// @route DELETE /api/users/:id
// @access Private/Staff/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        await user.remove()
        await axios.delete(URL + `/customers/${user.customerID}`, { headers: { "Authorization": `Bearer ${KEY}` } })
        res.json({ message: 'User Removed' })

    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

//========================================================================================================================
//===============================================Cart=====================================================================
//========================================================================================================================


// @desc Add Cart to User
// @route POST /api/users/cart
// @access Private
const addCartToUser = asyncHandler(async (req, res) => {
    // console.log(req.body)
    const user = await User.findById(req.user.id)
    if (user) {
        user.cart = req.body
        const updatedUser = await user.save()
        if (updatedUser) {
            res.status(201).json({
                message: "success"
            })
        } else {
            res.status(400)
            throw new Error('Invalid Cart Data')
        }
    }
    else {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

// @desc Get Cart from User
// @route GET /api/users/cart
// @access Private
const getCartFromUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    if (user) {
        res.json({
            cart: user.cart
        })
    }
    else {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})


// @desc Add WishList Item to User
// @route POST /api/users/wish/:pID
// @access Private
const addWishToUser = asyncHandler(async (req, res) => {
    // console.log(req.body)
    const user = await User.findById(req.user.id)
    if (user) {
        if (user.wishList.includes(req.params.pID)) {
            res.status(201).json({
                wishList: user.wishList
            })
        }
        else {
            user.wishList.push(req.params.pID)
            const updatedUser = await user.save()
            if (updatedUser) {
                res.status(201).json({
                    wishList: updatedUser.wishList
                })
            } else {
                res.status(400)
                throw new Error('Invalid Wish Data')
            }
        }
    }
    else {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

// @desc Remove WishList Item From User
// @route DELETE /api/users/wish/:pID
// @access Private
const removeWishFromUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    if (user) {
        const index = user.wishList.indexOf(req.params.pID);
        console.log(req.params.pID)
        if (index > -1) {
            user.wishList.splice(index, 1);
            console.log("Removed")
            console.log(user.wishList)
            const updatedUser = await user.save()
            if (updatedUser) {
                res.status(201).json({
                    wishList: updatedUser.wishList
                })
            } else {
                res.status(400)
                throw new Error('Invalid Wish Data')
            }
        }
        else {
            res.status(201).json({
                wishList: user.wishList
            })
        }
    }
    else {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})



export {
    registerUser,
    authUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    addCartToUser,
    getCartFromUser,
    addWishToUser,
    removeWishFromUser,
}
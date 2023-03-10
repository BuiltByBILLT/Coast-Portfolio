import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import cloverRoutes from './routes/cloverRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import fileRoutes from './routes/fileRoutes.js'
import shippingRoutes from './routes/shippingRoutes.js'
import brandRoutes from './routes/brandRoutes.js'
import discountRoutes from './routes/discountRoutes.js'
import merchantRoutes from './routes/merchantRoutes.js'
import avaTaxRoutes from './routes/avaTaxRoutes.js'
import poRoutes from './routes/poRoutes.js'
import matcherRoutes from './routes/matcherRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()
connectDB()

const app = express()

app.use(morgan('dev'))
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'))
// }
// if (process.env.NODE_ENV === 'production') {
//     app.use(morgan('dev'))
// }

app.use(express.json())



app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/brands', brandRoutes)
app.use('/api/discounts', discountRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/merchants', merchantRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/clover', cloverRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/shipping', shippingRoutes)
app.use('/api/tax', avaTaxRoutes)
app.use('/api/pos', poRoutes)
app.use('/api/matcher', matcherRoutes)


const __dirname = path.resolve()
if (process.env.NODE_ENV === 'production') {
    app.use('/prodimages', express.static(path.join(__dirname, 'frontend', 'public', 'prodimages')))
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))
} else {
    app.get('/', (req, res) => {
        res.send('API is running')
    })
}


app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold
))


import path from 'path'
import express from 'express'
import multer from 'multer'
import { staff, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

const errorHandler = (err, req, res, next) => {
    if (!req.file) {
        res.status(415).send("Please select a jpg, jpeg, or png file")
        // throw new Error('Please select file') //catch by custom error handler
        return
    }
    if (err) {
        console.log(req);
        console.log(req.file);
        console.error(err);
        throw new Error('Please select file')
        return res.sendStatus(500);
    }
    next()
}


const imageUpload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, path.join(process.cwd(), "frontend", "public", 'prodimages'))
        },
        filename(req, file, cb) {
            cb(null, file.originalname)
        }
    }),
    fileFilter: function (req, file, cb) {
        const filetypes = /jpg|jpeg|png/
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = filetypes.test(file.mimetype)
        if (extname && mimetype) {
            return cb(null, true)
        } else {
            return cb('jpg, jpeg, png only')
        }
    }
})

router.post('/prodimage', protect, staff, imageUpload.single('image'), errorHandler, (req, res) => {
    if (!req.file) {
        res.status(400)
        throw new Error('Please select file') //catch by custom error handler
    }
    // res.send(`/${req.file.path.replace('\\', '/')}`)
    res.send(`${req.file.filename}`)
})



export default router



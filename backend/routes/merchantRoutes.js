import express from 'express'
import path from 'path'
import { protect, staff } from '../middleware/authMiddleware.js'
import { getMerchant, getMerchants, saveMerchant } from '../controllers/merchantController.js'
import multer from 'multer';

// Multer Stuff
const merchantUpload = multer({
    dest: 'uploads/',
    fileFilter: function (req, file, cb) {
        const filetypes = /csv/
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = filetypes.test(file.mimetype)
        if (extname && mimetype) {
            return cb(null, true)
        } else {
            return cb('csv only')
        }
    }
});

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

// @route /api/merchants/
const router = express.Router()

router.post('/:name', protect, staff, merchantUpload.single('file'), errorHandler, saveMerchant)
router.get('/', getMerchants)
router.get('/:name', getMerchant)


export default router
import express from 'express'
import fs from 'fs'
import path from 'path'
import { staff, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

const getImages = (req, res) => {
    const IMAGES_DIRECTORY = path.join(process.cwd(), "frontend", "public", 'prodimages');
    // const replaced = IMAGES_DIRECTORY.replace('\\', ' / ')
    var files = fs.readdirSync(IMAGES_DIRECTORY)
    // files = fs.statSync(IMAGES_DIRECTORY, files[0]).mtime.getTime()
    files.sort(function (a, b) {
        return fs.statSync(path.join(IMAGES_DIRECTORY, b)).mtime.getTime() -
            fs.statSync(path.join(IMAGES_DIRECTORY, a)).mtime.getTime();
    });
    res.send(files)
}



// api/files
router.route('/images')
    .get(getImages)



export default router
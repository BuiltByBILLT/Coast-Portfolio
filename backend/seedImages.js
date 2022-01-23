import images from './data/images.js'
import categories from './data/categories.js'

import fs from 'fs'
import path from 'path'
import axios from 'axios'

async function downloadImages(image) {
    try {

        // Check Path
        const parts = image.split("/")
        if (parts.length !== 2 && parts.length !== 3) return
        if (parts.length === 3) {
            var full = path.resolve(process.cwd(), 'frontend', 'public', parts[0], parts[1], parts[2])
            var dir = path.resolve(process.cwd(), 'frontend', 'public', parts[0], parts[1])
        }
        if (parts.length === 2) {
            var full = path.resolve(process.cwd(), 'frontend', 'public', parts[0], parts[1])
            var dir = path.resolve(process.cwd(), 'frontend', 'public', parts[0])
        }
        if (fs.existsSync(full)) return // If Exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Download
        const writer = fs.createWriteStream(full)

        const url = 'https://coastairbrush.com/' + image
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })
        response.data.pipe(writer)

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })
    } catch (e) {
        console.log("download error: " + e.message)
        console.log("error url: " + image)
        throw e
    }
}

// downloadImage()

(async () => {
    var success = 0
    var error = []

    // Product Images
    for (let i = 0; i < 3; i++) {
        // for (let i = 0; i < images.length; i++) {
        const image = images[i];
        try {
            await downloadImages(image.imageSrc)
            console.log(image.imageSrc)
            success++
        } catch (e) {
            error.push({ link: image.imageSrc, message: e.message })
        }
    }

    // Category Images
    for (let i = 0; i < 3; i++) {
        // for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        try {
            await downloadImages(category.sectionImage)
            console.log(category.sectionImage)
            success++
        } catch (e) {
            error.push({ link: category.sectionImage, message: e.message })
        }
    }

    // Manual Images
    const manualImport = [
        "prodimages/IW_th2limited_1_500px_3.png",
        "prodimages/IW_th2limited_1_500px_3.png",
        "prodimages/H5100-HP-TH2-Fan-A1.jpg",
        "prodimages/H5100-D2.jpg",
        "prodimages/H5100-HP-TH2-Round-A1_2.jpg",
        "prodimages/IW_vaultlogo_footer800px.png",
    ]

    for (let i = 0; i < manualImport.length; i++) {
        const image = manualImport[i];
        try {
            await downloadImages(image)
            console.log(image)
            success++
        } catch (e) {
            error.push({ link: image, message: e.message })
        }
    }
    console.log(success)
    console.log(error)
})()


// Find Subfolders
// console.log(images.length)
// const regex = new RegExp('prodimages/\w*/', 'g');
// const folders = images.filter((image) => image.imageSrc.substr(11).includes("/"));
// let obj = {}
// folders.forEach(folder => {
//     let next = folder.imageSrc.indexOf("/", 11)
//     let sub = folder.imageSrc.slice(11, next)
//     obj[sub] = true
// })
// console.log(folders.length);
// console.log(obj);
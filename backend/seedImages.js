import images from './data/images.js'
import categories from './data/categories.js'

import fs from 'fs'
import path from 'path'
import axios from 'axios'

async function downloadProductImage(image) {
    const url = 'https://coastairbrush.com/' + image.imageSrc
    const dir = path.resolve(process.cwd(), 'frontend', 'public', 'prodimages', image.imageSrc.substr(11))
    const writer = fs.createWriteStream(dir)

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
}
async function downloadCategoryImage(cat) {
    var dir
    if (cat.sectionImage === "") return
    else if (cat.sectionImage.substr(0, 7) === "static/")
        dir = path.resolve(process.cwd(), 'frontend', 'public', 'static', cat.sectionImage.substr(7))
    else if (cat.sectionImage.substr(0, 7) === "images/")
        dir = path.resolve(process.cwd(), 'frontend', 'public', 'images', cat.sectionImage.substr(7))
    else if (cat.sectionImage.substr(0, 11) === "prodimages/")
        dir = path.resolve(process.cwd(), 'frontend', 'public', 'prodimages', cat.sectionImage.substr(11))
    else return

    const writer = fs.createWriteStream(dir)

    const url = 'https://coastairbrush.com/' + cat.sectionImage
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
}

// downloadImage()

(async () => {
    var success = 0
    var error = []
    for (let i = 0; i < 3; i++) {
        const image = images[i];
        try {
            await downloadProductImage(image)
            success++
        } catch (e) {
            error.push(image)
        }

    }
    for (let i = 0; i < 3; i++) {
        const cat = categories[i];
        try {
            await downloadCategoryImage(cat)
            success++
        } catch (e) {
            error.push(cat)
        }

    }
    console.log(success)
    console.log(error)
})()


// console.log(images.length)
// const regex = new RegExp('prodimages/\w*/', 'g');
// const folders = images.filter((image) => image.imageSrc.substr(11).includes("/"));
// let obj = {}
// folders.forEach(folder => {
//     let next = folder.imageSrc.indexOf("/",11)
//     let sub = folder.imageSrc.slice(11,next)
//     obj[sub]= true
// })
// console.log(folders.length);
// console.log(obj);
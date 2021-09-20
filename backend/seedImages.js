import images from './data/images.js'

import fs from 'fs'
import path from 'path'
import axios from 'axios'

async function downloadImage(image) {
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

// downloadImage()

(async () => {
    var success = 0
    var error = []
    for (let i = 0; i < 3; i++) {
        const image = images[i];
        try {
            await downloadImage(image)
            success++
        } catch (e) {
            error.push(image)
        }

    }
    console.log(success)
    console.log(error)
})()

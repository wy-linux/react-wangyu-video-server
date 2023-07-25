import fs from 'fs/promises'
import path from 'path'
import { captureVideoImg } from '../utils/index'
 
(async () => {
    const list = (await fs.readdir(path.join(__dirname, '../assets/video')))
    for(let i = 0; i < list.length; i++ ) {
        const inputPath = path.join(__dirname, '../assets/video', list[i])
        const outputPath = path.join(__dirname, '../assets/img', list[i].replace('mp4', 'jpg'))
        captureVideoImg(inputPath, outputPath)
    }
})()

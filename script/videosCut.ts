import fs from 'fs/promises'
import path from 'path'
import { cutVideoLength } from '../utils/index'
 
(async () => {
    const list = (await fs.readdir(path.join(__dirname, '../assets/video')))
    for(let i = 0; i < list.length; i++ ) {
        const inputPath = path.join(__dirname, '../assets/video', list[i])
        const outputPath = path.join(__dirname, '../assets/video-short', list[i])
        cutVideoLength(inputPath, outputPath)
    }
})()

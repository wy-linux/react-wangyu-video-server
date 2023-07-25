import express from 'express'
import router from './router'
import cors from 'cors'
import path from 'path'
import handleVideoPath from './utils/videoPath'

const app = express()
 
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router)

//视频资源路径重写
app.use(handleVideoPath)

//视频图片资源处理
app.use(express.static(path.join(__dirname, 'assets')))


export default app
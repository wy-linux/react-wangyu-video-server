import express, { Request }from "express"
import fs from 'fs/promises'
import fsSync from 'fs' //同步的fs，在某些不能async的场景下使用
import path from 'path'
import { User } from "../../model"
const Download = require('node-wangyu-bilidown')
import { captureVideoImg, cutVideoLength} from '../../utils'
import auth from  '../../utils/auth'

const router = express.Router()

export const VIDEO_PATH = path.join(__dirname, '../../assets/video/')
export const VIDEO_S_PATH = path.join(__dirname, '../../assets/video-short/')
export const IMG_PATH = path.join(__dirname, '../../assets/img/')

//视频列表接口
router.get('/video/list', async(req, res) => {
    //按照文件创建时间进行排序
    const list = (await fs.readdir(VIDEO_PATH))
        .sort((nameA, nameB) => {
            const statsA = fsSync.statSync(path.join(VIDEO_PATH, nameA))
            const statsB = fsSync.statSync(path.join(VIDEO_PATH, nameB))
            return statsA.birthtimeMs - statsB.birthtimeMs
        })
        .map((name) => name.split('.')[0])

    res.send({
        data: list
    })
})

//视频爬取接口
router.post('/video/spider', auth, async (req: Request, res) => {
    const user = await User.findOne({_id: req.userId})
    if(user?.isVip) {
        const BiliDown = new Download(
            req.body.url,
            req.body.name,
            './assets/video/'
        )
        BiliDown.start()
                .then(({title}: {title: string}) => {
                    //截取视频关键帧图片
                    captureVideoImg(`${VIDEO_PATH}/${title}.mp4`, `${IMG_PATH}/${title}.jpg`)
                    //剪切视频片段
                    cutVideoLength(`${VIDEO_PATH}/${title}.mp4`, `${VIDEO_S_PATH}/${title}.mp4`)
                    res.send({
                        message: '抓取成功',
                    })
                })
                .catch(() => {
                    res.status(400).send({
                        message: '抓取失败(某些特例本站无法抓取，请更换链接)',
                    })
                })
    } else {
        res.status(400).send({
            message: '爬虫功能仅限Vip用户使用！',
        })
    }
})


export default router
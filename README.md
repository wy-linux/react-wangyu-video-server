### Node + TypeScript + Express + MongoDB 视频点播直播后端接口
```shell
1. npm install  下载相关依赖
2. npm run start 启动接口
```
##### B站视频爬取
BiliDown视频爬虫：https://github.com/wy-linux/node-wangyu-bilidown 
```javascript
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
```
##### 视频资源路径重写
```javascript
const handleVideoPath = async (req: Request, _: Response, next: NextFunction) => {
    if(!req.url.includes('/video/')) {
        return next()
    }
    const videoName = decodeURIComponent(req.query.name as string)
    const token = req.query.token as string
    if(!token) {
        req.url = req.originalUrl = `/video-short/${videoName}`
    } else {
        try {
            const { id } = jwt.verify(token, SECRET) as {id: string}
            const user = await User.findOne({_id: id})
            if(user?.isVip) {
                req.url = req.originalUrl = `/video/${videoName}`
            } else {
                req.url = req.originalUrl = `/video-short/${videoName}`
            }
        } catch (error) {
            console.log('token校验失败！', error)
            req.url = req.originalUrl = `/video-short/${videoName}`
        }
    }
    next()
}
```
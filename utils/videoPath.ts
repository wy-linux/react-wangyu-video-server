import type { Request, Response, NextFunction} from "express"
import jwt from 'jsonwebtoken'
import { SECRET } from './secret'
import { User } from "../model"

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

export default handleVideoPath
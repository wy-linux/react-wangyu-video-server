import jwt from 'jsonwebtoken'
import { SECRET } from './secret'
import type { Request, Response, NextFunction } from 'express'

const auth = (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        return res.status(401).send({
            message: '暂无权限，登陆后操作！'
        })
    }
    const raw = String(req.headers.authorization).split(' ').pop()
    try {
        const tokenData = jwt.verify(raw!, SECRET) as {id: string}
        req.userId = tokenData.id
        next()
    } catch (error) {
        return res.status(401).send({
            message: '校验失败，请重新登录！'
        })
    }
}
export default auth
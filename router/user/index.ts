import express from "express"
import type { Request } from "express"
import jwt from 'jsonwebtoken'
import { SECRET } from "../../utils/secret"
import { User } from "../../model"
//导出sendEmail函数发送验证码
import sendEmail from '../../email'
import { random } from '../../utils'
import auth from '../../utils/auth'

const router = express.Router()
//设置一个对象用于存储用户email以及对应的验证码
const identify: Record<string, string> = {}

//获取用户信息接口
router.get('/user/info', auth, async(req: Request, res) => {
    const user = await User.findOne({_id: req.userId})
    if(user) {
        const { email, isVip, coinCount } = user
        res.send({
            data: {
                email,
                coinCount,
                isVip
            }
        })
    } else {
        res.status(400).send({
            message: '用户名不存在'
        })
    }
})

//登录接口
router.post('/user/login', async(req, res) => {
    const user = await User.findOne({
        email: req.body.email
    })
    if(!user) {
        return res.status(400).send({
            message: '用户名不存在'
        })
    }
    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if(!isPasswordValid) {
        return res.status(400).send({
            message: '密码不正确'
        })     
    }
    //生成token
    const token = jwt.sign({
        id: String(user._id)       
    }, SECRET)

    res.send({
        message: '登录成功',
        data: {
            token
        }
    })
})

//注册接口
router.post('/user/register', async(req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    })
    if(user) {
        return res.status(400).send({
            message: '当前用户名已经存在'
        })
    }
    const isCodeValid = req.body.code === identify[req.body.email]
    if(!isCodeValid) {
        return res.status(422).send({
            message: '验证码错误，请重新获取'
        })            
    }
    await User.create({
        email: req.body.email,
        password: req.body.password
    })
    
    res.send({
        message: '注册成功'
    })
})

//重置密码接口
router.post('/user/reset', async(req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    })
    if(!user) {
        return res.status(400).send({
            message: '用户名不存在'
        })
    }
    const isCodeValid = req.body.code === identify[req.body.email]
    if(!isCodeValid) {
        return res.status(422).send({
            message: '验证码错误，请重新获取'
        })            
    }

    await User.updateOne({email: user.email}, {$set:{password: req.body.password}})
    res.send({
        message: '修改成功'
    })
})

//验证码获取接口
router.post('/user/code', async(req, res) => {
    identify[req.body.email]= random(6)
    try {
        await sendEmail({
            from: '1726720192@qq.com',
            to: req.body.email,
            subject: '邮箱验证',
            text: `验证码：${identify[req.body.email]}。您正在进行邮箱验证，5分钟内有效。请勿告诉其他人!`
        })
        res.send({
            message: '发送成功'
        })
    } catch(err) {
        res.send({
            message: '发送失败，请稍后重试或请求网站管理员帮助'
        })
    } finally {
        const timer = setTimeout(() => {
            delete identify[req.body.email]
            clearTimeout(timer)
        }, 1000 * 60 * 5);
    }
})

//退出登录接口
router.get('/user/logout', (req, res) => {
    res.send({
        message: '退出登录'
    })
})

export default router
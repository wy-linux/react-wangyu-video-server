
import express from "express"
import userRouter from './user'
import videoRouter from './video'

const router = express.Router()

router.use(userRouter)
router.use(videoRouter)

export default router

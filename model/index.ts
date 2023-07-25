import mongoose from 'mongoose'
import UserSchema from './user'

mongoose.connect('mongodb://root:root@localhost:27017/video')
// 监听 Mongoose 的 connected 事件
mongoose.connection.on('connected', () => {
    console.log('连接MongoDB成功!');
})
// 监听 Mongoose 的 error 事件，用于处理连接错误
mongoose.connection.on('error', (err) => {
  console.error('连接MongoDB失败:', err);
})
// 监听 Mongoose 的 disconnected 事件，用于处理断开连接
mongoose.connection.on('disconnected', () => {
  console.log('断开MongoDB连接!');
})

export const User = mongoose.model('User', UserSchema)
 
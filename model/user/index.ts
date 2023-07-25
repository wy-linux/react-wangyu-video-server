import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    email: {type: String, unique: true},
        //MD5加密不安全, 使用bcrypt
    password: {type: String, set(val: string) {
        return require('bcrypt').hashSync(val, 10)
    }},
    isVip: {type: Boolean, default: false},
    coinCount: {type: Number, default: 0}
})

export default UserSchema
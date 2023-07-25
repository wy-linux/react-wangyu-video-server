import app from './app'
import https from 'https'
import fs from 'fs'
import path from 'path'

const key  = fs.readFileSync(path.resolve(__dirname, 'ssl/wangyu.cloud.key'), 'utf8');
const cert = fs.readFileSync(path.resolve(__dirname, 'ssl/wangyu.cloud_bundle.crt'), 'utf8')
const options = {
    key,
    cert 
}
const port = 5000
const server = https.createServer(options, app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function onError(error: any) {
    console.log(error);
}

function onListening(error: any) {
    console.log('Listening on', port);
}

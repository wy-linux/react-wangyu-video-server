import child_process from 'child_process'

//生成随机数
export function random(length: number) {
    let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let result = ''
    for (var i = 0; i < length; i++) {
        let a = arr[Math.floor(Math.random() * 10)]
        result += a
    }
    return result
}

//捕获视频图片
export function captureVideoImg(input: string, output: string) {
    child_process.exec(`ffmpeg -ss 00:00:05 -i ${input} -vframes 1 -q:v 5 ${output}`, (error, stdout, stderr) => {
        if(error){
            console.error("捕获视频图片失败",error);
        }else{
            console.log("捕获视频图片成功",stdout);
        }
    })   
}

//截取视频长度
export function cutVideoLength(input: string, output: string) {
    child_process.exec(`ffmpeg -i ${input} -ss 00:00:00 -t 00:00:10 -c:v copy -c:a copy ${output}`, (error, stdout, stderr) => {
        if(error){
            console.error("截取视频长度失败",error);
        }else{
            console.log("截取视频长度成功",stdout);
        }
    })   
}
//生成HLS直播流
// ffmpeg -i wy.mp4 -hls_time 3 -hls_list_size 0 -hls_segment_filename ./wy_%05d.ts ./wy.m3u8
 export function createHls(input: string, output: string) {
    child_process.exec(`ffmpeg -i ${input}  -acodec copy -hls_time 10 -hls_list_size 0 ${output}`, (error, stdout, stderr) => {
        if(error){
            console.error("生成HLS直播流失败",error);
        }else{
            console.log("生成HLS直播流成功",stdout);
        }
    })       
}

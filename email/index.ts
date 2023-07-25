import nodemailer from "nodemailer"

interface IOptions {
    from: string;
    to: string;
    subject: string;
    text: string
}

async function sendEmail(options: IOptions) {
    let transporter = nodemailer.createTransport({
        host: "smtp.qq.com",
        port: 465,
        // secure: true, // true for 465, false for other ports
        // secureConnection: true,
        auth: {
            user: '1726720192@qq.com',
            pass: 'fhsxumbufbjjcgcg'
        },
    })
    let info = await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        // html: 'html文本',
        // attachments:[{
        //     filename: 'app.js',
        //     path: './app.js'
        // }]
    })
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}


export default sendEmail
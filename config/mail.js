import { createTransport } from "nodemailer";
import 'dotenv/config';

export const mailTransport = createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});


// export const sendMail = async (to, subject, text, html) => {
//     try {
//         await mailTransport.sendMail({
//             from: '"Tale-net" <talenetgh@gmail.com>', // sender address
//             to, // list of receivers
//             subject, // Subject line
//             text, // plain text body
//             html, // html body
//         });
//         console.log('Email sent successfully');
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };
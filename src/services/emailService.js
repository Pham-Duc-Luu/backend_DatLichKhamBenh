const nodemailer = require('nodemailer');
require('dotenv').config();
import db from '../models/index';
import { v4 as uuidv4 } from 'uuid';

let buildToken = (doctorId, token) => {
    let result = '';

    result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;

    return result;
};

let handleSendEmail = async (data) => {
    return new Promise(async (resolve, reject) => {
        // Cấu hình gửi email
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        let id = uuidv4();

        data.token = id;
        // Thông tin email
        let mailOptions = {
            from: '"Sender Name" <email@example.com>', // sender address
            to: data.email, // list of receivers
            subject: 'Subject Line', // Subject line
            text: 'Plain text content', // plain text body
            html: `<div> 
            <h2>Xin chào ${data.firstName}</h2>
            <a href="${buildToken(data.doctorId, id)}">xac nhan</a>

        
        </div>`, // html body
        };

        // Gửi email
        let info = await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // console.log(error);
                reject({ errCode: -1 });
            }

            // console.log('Message sent: %s', info.messageId);
            resolve(data);
        });
    });
};

module.exports = {
    handleSendEmail,
};

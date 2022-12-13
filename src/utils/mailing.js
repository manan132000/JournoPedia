const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

const mail = (to,body,attachments) => {

    const transport = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASSWORD
        }
    }));
    
    const options = {
        from: 'JournoPedia Team',
        to: to,
        subject: 'JournoPedia Team',
        html: body,
        attachments: attachments
    }
    
    transport.sendMail(options, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Sent' + info.response);
        }
    });
}

module.exports = {mail};
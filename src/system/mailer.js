var conf = require("@this/conf/conf");
var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: conf.email_service,
    port: conf.email_port,
    auth: {
        user: conf.email_user,
        pass: conf.email_password
    }
});




//change name of function sendMail in sendConfirmation
export  function sendConfirmation(_activationToken, _email){
    try {
        const url = `http://${conf.host}:${conf.serverPort}/activation/${_email}/${_activationToken}`;

        let mailOptions = {
            subject: 'Confirmation Email',
            to: _email,
            from: '<demo@email.com>',
            html: `Hello, please click this <a href=${url}>confirmation link</a> to activate your account!`
        };

        return transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.log(error + "\n");
            } else {
                console.log("Email sent!");
            }
        })

    } catch (error) {
        console.log("Could not send activation mail: " + error);
    }
}

export function sendRecovery(_recoveryToken, _email){
    try {
        const url = `http://${conf.host}:${conf.serverPort}/pass_recover/${_email}/${_recoveryToken}`;

        let mailOptions = {
            subject: 'Recovery password',
            to: _email,
            from: '<demo@email.com>',
            html: `Hello, please click this <a href=${url}>confirmation link</a> to change password for your account!`
        };

        return transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.log(error + "\n");
            } else {
                console.log("Email sent!");
            }
        })

    } catch (error) {
        console.log("Could not send recovery mail: " + error);
    }
}


export function sendPassword(pass, _email){
    try {

        let mailOptions = {
            subject: 'New password changed',
            to: _email,
            from: '<demo@email.com>',
            html: `Hello, this is the new password <strong>${pass}</strong> for your account!`
        };

        return transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.log(error + "\n");
            } else {
                console.log("Email sent!");
            }
        })

    } catch (error) {
        console.log("Could not send new password mail: " + error);
    }
}
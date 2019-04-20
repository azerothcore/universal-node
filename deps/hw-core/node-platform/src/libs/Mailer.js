var nodemailer = require("nodemailer");
var conf = require("@this/conf/conf");

export default class Mailer {
    constructor(config) {
        this.transporter = nodemailer.createTransport(config);

        Object.freeze(this.transporter);
    }

    //change name of function sendMail in sendConfirmation
    sendConfirmation(_activationToken, _email, _id) {
        try {
            const url = `http://${conf.host}:${conf.clientPort}/activation/${_id}/${_activationToken}`;

            let mailOptions = {
                subject: 'Confirmation Email',
                to: _email,
                from: '<demo@email.com>',
                html: `Hello, please click this <a href=${url}>confirmation link</a> to activate your account!`
            };

            return this.transporter.sendMail(mailOptions, (error, response) => {
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

    sendRecovery(_recoveryToken, _email) {
        try {
            const url = `http://${conf.host}:${conf.clientPort}/pass_recover/${_email}/${_recoveryToken}`;

            let mailOptions = {
                subject: 'Recovery password',
                to: _email,
                from: '<demo@email.com>',
                html: `Hello, please click this <a href=${url}>confirmation link</a> to change password for your account!`
            };

            return this.transporter.sendMail(mailOptions, (error, response) => {
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


    sendPassword(pass, _email) {
        try {

            let mailOptions = {
                subject: 'New password changed',
                to: _email,
                from: '<demo@email.com>',
                html: `Hello, this is the new password <strong>${pass}</strong> for your account!`
            };

            return this.transporter.sendMail(mailOptions, (error, response) => {
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
}

const mailer = require("nodemailer");
const { Options } = require("nodemailer/lib/smtp-transport");

require("dotenv").config();

/**
 * Send emails using gmail
 *
 * @param {Options} options
 */
const dispatchMail = (options) => {
    const transporter = mailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    transporter.sendMail(options, (error, info) => {
        if (error === "read ECONNRESET") {
            console.error("[SMTP] Connection Dropped, Retrying...");
            return dispatchMail(options);
        }

        if (error) return console.error("[SMTP] An error occured", error);
    });
};

module.exports = {
    dispatchMail,
};

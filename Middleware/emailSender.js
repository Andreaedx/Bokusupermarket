const nodemailer = require("nodemailer");

//create a transporter object
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent sucessfully");
    } catch (error) {
        console.log("Error sending mail", error.message);
    }
}

module.exports = sendMail;
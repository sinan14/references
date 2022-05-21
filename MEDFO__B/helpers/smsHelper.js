// var nodemailer = require("nodemailer");
// const TwoFactor = new (require('2factor'))('200d77d3-bc60-11eb-8089-0200cd936042')

// module.exports = {
//     sendSMS: (toPhone,content) => {
//         return new Promise(async (resolve, reject) => {
//             TwoFactor.sendTransactional(["1234567890", "2103456789"], "Your message", 'YOUR SENDER ID')
//         .then((response) => {
//         console.log(response)
//         }, (error) => {
//         console.log(error)
//         })
//             // var smtpTransport = nodemailer.createTransport({
//             //     service: "gmail",
//             //     auth: {
//             //         user: "snackydemo@gmail.com",
//             //         pass: "Ashriya@123",
//             //     },
//             // });
//             // var mailOptions = {
//             //     to: toMail,
//             //     from: "snackydemo@gmail.com",
//             //     subject: subject,
//             //     text: "Welcome to  Medimall\n\n" + "hi.\n" + content,
//             // };

//             // smtpTransport.sendMail(mailOptions, function (err, info) {
//             //     console.log(err);
//             //     if (err) {
//             //         resolve(true);
//             //     } else {
//             //         resolve(false);
//             //     }
//             // });
//         });
//     },
// };

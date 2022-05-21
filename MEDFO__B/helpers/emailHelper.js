var nodemailer = require("nodemailer");
module.exports = {
    sendEmail: (toMail, subject, content) => {
        return new Promise(async (resolve, reject) => {
         
            var smtpTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "doctors.medimall@gmail.com",
                    pass: "medimall@dr",
                },
            });
            var mailOptions = {
                to: toMail,
                from: "doctors.medimall@gmail.com",
                subject: subject,
                text: "Welcome to  Medimall\n\n" + "hi.\n" + content,
            };

            smtpTransport.sendMail(mailOptions, function (err, info) {
                console.log(err);
                if (err) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    },
};

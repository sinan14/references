var nodemailer = require("nodemailer");

module.exports  = {
    getSmtpTransport: () =>  {
        return new Promise(async (resolve, reject) => {
            var smtpTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "doctors.medimall@gmail.com",
                    pass: "medimall@dr",
                },
            });           
            resolve(smtpTransport)
        })
        
    }
}
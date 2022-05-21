var nodemailer = require("nodemailer");
var moment =require('moment')

// const smtpTransportDetails = require('./email/smtpTransport')
module.exports = {
    sendEmail: (toMail, name) => {
        return new Promise(async (resolve, reject) => {
            var smtpTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "doctors.medimall@gmail.com",
                    pass: "medimall@dr",
                },
            });

           // var smtpTransport = smtpTransportDetails.getSmtpTransport()
            //  const imgPath = process.env.BASE_URL + "/doctor/email";
            const imgPath = process.env.BASE_URL + "doctor/email"
            let subject = "The Stepping Stone To The Healthcare Zone";
            let doctorName = name;
          
        
            const date = moment(Date.now()).format('Do MMM YYYY')
         
            var mailOptions = {
                to: toMail,
                from: "doctors.medimall@gmail.com",
                subject: subject,
                html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="icon" href="img/favi.png" type="image/x-icon">
                    <link rel="shortcut icon" href="img/favi.png" type="image/x-icon">
                    <title>Medimall | Webmail </title>
                      <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
                    <link href="http://fonts.cdnfonts.com/css/old-bridges-rough" rel="stylesheet">
                
                    <link href="css/font-awesome.min.css" rel="stylesheet">

                <style type="text/css">
                    
                </style>
                
                 
                </head>
                
                <body style=" text-align: center;
                            margin: 0 auto;
                           
                            display: block;
                            font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;width: 500px; margin: 20px auto;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="background-image: url(${imgPath}/white-concrete-wall.png);">
                        <tbody>
                            <tr>
                                <td>
                                    
                                    
                                     <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                                       <tr class="header">
                                           <td align="center" valign="top">
                                               <img src="${imgPath}/top.png" class="stman">
                                             </td>

                                        </tr>
                                    </table>
                                    
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" >
                          <thead>
                             <tr>
                                <h1 style=" font-size: 22px;color: #1E1E1E;margin-bottom: 0px"><span style="opacity: 0.5;font-weight: 600;">Hello </span>${doctorName}</h1>
                            </tr>
                        </thead>
                        <tr >
                            
                            <td>
                                <div class="section2" style="margin: 25px; margin-top:30px;  background: transparent url(${imgPath}/blue.png); background-size: cover;background-repeat: no-repeat;box-shadow: 1px 2px 7px #0000002b;padding:22px;
                                                   border-radius: 8px;position: relative;">
                                  <table style="width:100%;">
                                       <tr> 
                                   <td>
                                   <div class="handl" style="display: flex;align-items: center;">
                                       <div style="width: 100%;text-align: left;">  <img src="${imgPath}/tick.png" style="float:left; margin-top: -8px; padding-right:19px;">
                                        <h2 style="color: #fff; line-height: 1; opacity: 1; margin-bottom: 0px; margin-top: 8px;">
                                            <span style="font-weight: 100;">Application </span><span style="font-weight: 600;">Recieved</span> </h2>
                                        <label style="color: #FFFFFF; opacity: 0.77;margin: 0 0 0 3px;font-size: 9px;">${date}</label></div>
                                     </div>
                                     </td>
                                    <td><img src="${imgPath}/scope.png"></td>
                                    </tr>
                                  </table>
                                   

                                    <p style="color: #FFFFFF;text-align: left;padding: 0px 27px; padding-top: 17px;">Hey There,</p>
                                    <p style="color: #FFFFFF; text-align: left;opacity: 0.70;font-size: 14px;line-height: 2;padding: 0px 27px; padding-top: 7px;">Healthy Greetings From Medimall. We are delighted to receive your application to join us on our healthcare journey. 
                                    Please allow us a few days to verify the data submitted and approve your request. In the meantime, you may peruse our app
                                    and find out the benefits you shall be receiving. We know your going to be making Healthy Saves, Everyday.</p>
                                    <table style="width: 100%;">
                                        <tr>
                                            <td>
                                          <div class="btngreensection" style="text-align:left; padding-top: 15px;   padding-left: 27px;">
                                        <h5 type="button" class="green" style="margin: 0;color: #FFFFFF;opacity: 0.70;font-weight: 400;">Healthy Regards,</h5>
                                        <img src="${imgPath}/doc.png" width="90">
                                        <h6 style="margin: 0; font-size: 8px; color:#0A1E56;opacity:0.5; line-height:0;">Chairperson</h6>
                                    </div>
                                            </td>
                                            
                                            <td><img src="${imgPath}/invitation.png" style="right: 40px;float:right"></td>
                                        </tr>
                                    </table>
                                    
                                    
                                    
                                    
                                    
                                </div>

                            </td>
                        </tr>
                    </table>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 1px;">
                        <tr class="header">
                            <td align="center" valign="top">
                            <div class="box1" style="margin: 25px; border-radius: 7px;background-color: #f8f8f8; border:2px solid #e2e2e2; padding: 20px;background-size: cover;
                            background-repeat: no-repeat;">

                            <img src="${imgPath}/becon.png">
                                   
                                </div>
                            </td>

                        </tr>
                    </table>
                    
                    
                    
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr class="header">
                                            <td align="center" valign="top">
                                                <img src="${imgPath}/logo.png" class="logo" style="width: 100px; margin-top: 20px;">
                                            </td>
                
                                        </tr>
                                    </table>
                                     <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr class="header">
                            <td align="center" valign="top">
                                 <div class="made11" style="margin: 30px 0px;">
                                   <img src="${imgPath}/made.png" class="heart">

                                    </div>
                            </td>

                        </tr>
                    </table>
                    
                                   
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </body>
                
                </html>`,
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

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const sendMail = async (from, to, subject, html, text = null) => {
  try {
    //create mail

    const mail = {
      to,
      from,
      subject,
      ...(text && { text }),
      html,
    };

    //send mail

    await sgMail.send(mail);

    return {
      status: true,
      message: `mail successfully sent to ${to}.`,
    };
  } catch (error) {
    return { status: false, error };
  }
};

module.exports = { sendMail };

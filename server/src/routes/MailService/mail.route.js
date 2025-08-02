const nodemailer = require ('nodemailer');
const express = require ('express')
const router = express.Router ();
const path = require ('path');
const fs = require ("node:fs");
const dayjs = require ("dayjs");
// TODO: Add mail port for this
router.post ('/send-email', async (req, res) => {
  const {
    roomName, totalRoom, hotelLocation, totalPrice, checkInDay, checkOutDay, totalStayDay, paymentMethod,
    name, idenCard, email, phoneNum, gender, dob
  } = req.body;

  const password = process.env.MAIL_PASSWORD;

  if (!roomName || !totalRoom || !checkInDay || !checkOutDay || !paymentMethod || !hotelLocation || !totalPrice
    || !checkInDay || !checkOutDay || !paymentMethod || !totalStayDay || !name || !idenCard || !email || !gender || !dob) {
    return res.status (400).send ('Recipient email address is required');
  }

  console.log ('all path received');

  const formattedCheckInDay = dayjs (checkInDay).format ('DD/MM/YYYY');
  const formattedCheckOutDay = dayjs (checkOutDay).format ('DD/MM/YYYY');
  const formattedBirthday = dayjs (dob).format ('DD/MM/YYYY');

  // Test in deployment
  let transporter = nodemailer.createTransport ({
    service: "gmail",
    auth: {
      user: "thymai.1510@gmail.com",
      pass: password,
    },
  });

  transporter.verify ((error, success) => {
    if (error) {
      console.error ("SMTP connection error:", error);
    } else {
      console.log ("SMTP server is ready to take messages");
    }
  });
  //header
  const emailHtmlPath = path.join (__dirname, './email.html');
  let emailHtml = fs.readFileSync (emailHtmlPath, 'utf8');
  emailHtml = emailHtml.replace ('{{roomName}}', roomName).replace ('{{totalRoom}}', totalRoom).replace ('{{hotelLocation}}', hotelLocation).replace ('{{totalPrice}}', totalPrice).replace ('{{checkInDay}}', formattedCheckInDay).replace ('{{checkOutDay}}', formattedCheckOutDay).replace ('{{totalStayDay}}', totalStayDay).replace ('{{paymentMethod}}', paymentMethod).replace ('{{name}}', name).replace ('{{name2}}', name).replace ('{{idenCard}}', idenCard).replace ('{{email}}', email).replace ('{{phoneNum}}', phoneNum || 'unknown').replace ('{{gender}}', gender).replace ('{{dob}}', formattedBirthday);

  let message = {
    from: 'thymai.1510@gmail.com',
    to: email,
    subject: 'Your TAB placing order',
    html: emailHtml
  };
  try {
    const info = await transporter.sendMail (message);
    console.log ('Email sent: ' + info.response);
    res.status (200).send ('Email sent successfully');
  } catch (error) {
    console.log (error);
    return res.status (500).send ('Error sending email');
  }
});

module.exports = router
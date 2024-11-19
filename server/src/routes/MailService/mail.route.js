const nodemailer = require('nodemailer');
const express=require('express')
const router=express.Router();
const path=require('path');
const fs = require("node:fs");
const dayjs = require("dayjs");

router.post('/send-email', async (req, res) => {
    const { roomName, totalRoom, hotelLocation, totalPrice, checkInDay, checkOutDay, totalStayDay, paymentMethod,
        name, idenCard, email, phoneNum, gender, dob } = req.body;

    const password = process.env.MAIL_PASSWORD;

    if (!roomName || !totalRoom || !checkInDay || !checkOutDay || !paymentMethod || !hotelLocation || !totalPrice
        || !checkInDay || !checkOutDay || !paymentMethod || !totalStayDay || !name || !idenCard || !email || !gender || !dob) {
        return res.status(400).send('Recipient email address is required');
    }

    console.log('all path received');

    const formattedCheckInDay = dayjs(checkInDay).format('DD/MM/YYYY');
    const formattedCheckOutDay = dayjs(checkOutDay).format('DD/MM/YYYY');
    const formattedBirthday = dayjs(dob).format('DD/MM/YYYY');

    let config = {
        service: 'gmail',
        auth: {
            user: 'thymai.1510@gmail.com',
            pass: password
        }
    };

    let transporter = nodemailer.createTransport(config);

    //header
    const emailHtmlPath = path.join(__dirname, './email.html');
    let emailHtml = fs.readFileSync(emailHtmlPath, 'utf8');
    emailHtml = emailHtml
        .replace('{{roomName}}', roomName)
        .replace('{{totalRoom}}', totalRoom)
        .replace('{{hotelLocation}}', hotelLocation)
        .replace('{{totalPrice}}', totalPrice)
        .replace('{{checkInDay}}', formattedCheckInDay)
        .replace('{{checkOutDay}}', formattedCheckOutDay)
        .replace('{{totalStayDay}}', totalStayDay)
        .replace('{{paymentMethod}}', paymentMethod)
        .replace('{{name}}', name)
        .replace('{{name2}}', name)
        .replace('{{idenCard}}', idenCard)
        .replace('{{email}}', email)
        .replace('{{phoneNum}}', phoneNum || 'unknown')
        .replace('{{gender}}', gender)
        .replace('{{dob}}', formattedBirthday);

    let message = {
        from: 'thymai.1510@gmail.com',
        to: email,
        subject: 'Your TAB placing order',
        html: emailHtml
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
    }
});

// let mailGenerator= new mailgen({
//     theme:'cerberus',
//     product:{
//         name:'Take A Breath',
//         link:'https://www.totallyradio.com/images/festival_images_TakeABreath.png',
//         logo:'https://i.imgur.com/xSiP9ze.png',
//     },
// })
//
// let response={
//     body:{
//         name:'Tan Phuc',
//         intro:`Thank you for choosing TAB's services!`,
//         text:'Order information',
//         table:{
//             data:[
//                 {
//                     service:'Đặt phòng',
//                     item:'Phòng...',
//                     quantity:'2',
//                     description:'Very cute pie',
//                     price:'50$',
//                     checkInDay:'',
//                     checkOutDay:'',
//                 }
//             ]
//         },
//         text2:'Customer information',
//         table2:{
//             data:[
//                 {
//                     name:'Mai Thy',
//                     phoneNumber:'0123456789',
//
//                 }
//             ]
//         },
//         outro:'This is an auto generate email, please do-not reply this',
//         customCSS:{
//             body:{
//                 maxWidth:'90%',
//                 display: 'flex',
//                 alignItems:'center',
//                 justifyContent:'center'
//             }
//         }
//     }
// }
//
// let mail=mailGenerator.generate(response)
module.exports=router
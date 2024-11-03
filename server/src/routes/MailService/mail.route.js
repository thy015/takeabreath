const nodemailer = require('nodemailer');
const express=require('express')
const router=express.Router();

const mailgen=require('mailgen')
router.post('/send-email', (req, res) => {
    const { toUser} = req.body;
    const password=process.env.MAIL_PASSWORD;

    if (!toUser) {
        return res.status(400).send('Recipient email address is required');
    }
    let config={
        service:'gmail',
        auth:{
            user:'thymai.1510@gmail.com',
            pass:password
        }
    }
    let transporter=nodemailer.createTransport(config);
    //header
    let mailGenerator= new mailgen({
        theme:'default',
        product:{
            name:'Take A Breath',
            link:'https://www.totallyradio.com/images/festival_images_TakeABreath.png',
            logo:'https://i.imgur.com/xSiP9ze.png',
        }
    })

    let response={
        body:{
            name:'Tan Phuc',
            intro:`Thank you for choosing TAB's services!`,
            table:{
                data:[
                    {
                        item:'A cutie pie',
                        description:'Very cute pie',
                        price:'50$'
                    }
                ]
            },
            outro:'This is an auto generate email, please do-not reply this',
            customCSS:{
                body:{
                    maxWidth:'90%',
                    display: 'flex',
                    alignItems:'center',
                    justifyContent:'center'
                }
            }
        }
    }

    let mail=mailGenerator.generate(response)

        let message = {
        from: 'thymai.1510@gmail.com',
        to:toUser,
        subject: 'Your TAB placing order',
        html:mail
    };

    // Send the email
    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent successfully');
    });
    return res.status(200).json({message:'gmail sent successfully'});
});

module.exports=router
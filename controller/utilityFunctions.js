const nodemailer=require('nodemailer');
const passwordValidator = require('password-validator');
const schema = new passwordValidator();
const path=require('path');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config');
const medilabDatabse=require('../models/db');



// adding properties to password
schema
.is().min(8)                                 
.is().max(100)         
.has().uppercase(1)                             
.has().lowercase(1)                             
.has().digits(1)                               
.has().not().spaces(0,'Password must not contain spaces');

const passwordErrorsMessages = {
    min: 'Password should be at least 8 characters long. ',
    max: 'Password should be be a maximum of 64 characters long. ',
    uppercase: 'Password should have uppercase characters. ',
    lowercase: 'Password should have lowercase characters. ',
    digits: 'Password should contain digits. ',
    spaces: 'Password should not contain spaces. ',
    blank: 'Password should not be blank. '
}

function sendMailUtil(to,subject,message){
    let transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.USER_NAME,
            pass:process.env.USER_PASSWORD
        }
    });

    let mailOptions={
        to:to,
        subject:subject,
        text:message,
        attachments: [
            {
                filename: 'medilab.png',
                path: path.join(__dirname,'..','public/medilab.png'),
                cid:'img'
            }
        ],
        html: `<p>${message} </p><img style="width:250px;" src="cid:img">`
    };

    transporter.sendMail(mailOptions,(err,success)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Email send successfully");
        }
    });
}

function passwordCheck(password){
    let ps=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
    return password.match(ps);
}

function requireAuth(req,res,next){
    const token=req.cookies.jwt;
    // check if jwt exit & is verified
    if(token){
        jwt.verify(token,JWT_SECRET,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/auth/login');
            }else{
                console.log(decodedToken);
                next();
            }

        });
    }
    else{
        res.redirect('/auth/login');
    }
}

function checkUser(req,res,next){
    const token=req.cookies.jwt;
    if(token){
        jwt.verify(token,JWT_SECRET,async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user=null;
                next();
            }
            else{
                console.log(decodedToken);
                let role=decodedToken.role;
                let email=decodedToken.email;
                let sql='select * from '+role+' where _email=?';
                medilabDatabse.query(sql,[email],(err,result)=>{
                    if(err){
                        console.log(err);
                        res.locals.user=null;
                        next();
                    }
                    console.log(result);
                    res.locals.user=result;
                    next();
                })
            }
        })
    }
    else{
        res.locals.user=null;
        next();
    }
}

module.exports={
    sendMailUtil,
    passwordCheck,
    passwordErrorsMessages,
    schema,
    requireAuth,
    checkUser
}
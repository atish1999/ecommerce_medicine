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

function requireAuthDoctor(req,res,next){
    const token=req.cookies.jwt;
    // check if jwt exit & is verified
    if(token){
        jwt.verify(token,JWT_SECRET,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/auth/login');
            }else if(decodedToken.role==='doctor'){
                next();
            }
            else{
                res.status(404).render('404');
            }

        });
    }
    else{
        res.redirect('/auth/login');
    }
}

function requireAuthUsers(req,res,next){
    const token=req.cookies.jwt;
    // check if jwt exit & is verified
    if(token){
        jwt.verify(token,JWT_SECRET,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/auth/login');
            }else if(decodedToken.role==='users'){
                next();
            }
            else{
                res.status(404).render('404');
            }

        });
    }
    else{
        res.redirect('/auth/login');
    }
}

function requireAuthShopOwner(req,res,next){
    const token=req.cookies.jwt;
    // check if jwt exit & is verified
    if(token){
        jwt.verify(token,JWT_SECRET,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/auth/login');
            }else if(decodedToken.role==='shopowner'){
                next();
            }
            else{
                res.status(404).render('404');
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
                let role=decodedToken.role;
                let email=decodedToken.email;
                let sql='select * from '+role+' where _email=?';
                medilabDatabse.query(sql,[email],(err,result)=>{
                    if(err){
                        console.log(err);
                        res.locals.user=null;
                        next();
                    }
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

function getTodayDate(){
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${year}-${month}-${day}`;
    return currentDate;
}

function uploadFile(blogtitle,blogcontent,blogimage,doctorId){
    try {
        blogimage.name=Date.now()+blogimage.name;
        let uploadPath=path.join(__dirname,'..','/public/uploads',blogimage.name);
        let currentDate=getTodayDate();

        blogimage.mv(uploadPath,(err)=>{
            if(err){
                return err;
            }
            let sql='insert into blog(_title,_content,_image,_date,_did) values(?,?,?,?,?)';
            medilabDatabse.query(sql,[blogtitle,blogcontent,blogimage.name,currentDate,doctorId],(err,result)=>{
                if(err){
                    console.log(err);
                    return err;
                }
            })
        });
    } catch (error) {
        return error;
    }
    
}

module.exports={
    sendMailUtil,
    passwordCheck,
    passwordErrorsMessages,
    schema,
    requireAuthUsers,
    requireAuthDoctor,
    requireAuthShopOwner,
    checkUser,
    uploadFile
}
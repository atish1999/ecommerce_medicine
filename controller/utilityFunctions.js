const nodemailer=require('nodemailer');
const passwordValidator = require('password-validator');
const schema = new passwordValidator();

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

function sendMail(to,subject,message){
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
        text:message
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

module.exports={
    sendMail,
    passwordCheck,
    passwordErrorsMessages,
    schema
}
const medilabDatabase=require('../models/db');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config');
const {sendMailUtil,schema}=require('./utilityFunctions');


function loginGet(req,res){
    let message=req.flash('error');
    res.render('login',{message});
}

async function loginPost(req,res){
    try {
        let {role,email,password}=req.body;
        let sql="select * from "+role+" where _email=?;";
        medilabDatabase.query(sql,[email],(err,result)=>{
            if(err){
                return res.status(500).send("Server Error. Try Again after some time");
            }
            if(result.length==0){
                req.flash('error','no such user exit');
                res.redirect('/auth/login');
                return;
            }
            bcrypt.compare(password, result[0]._password, function(err, response) {
                if (err){
                    // for now logging the message
                    // console.log(err.message);
                    // return;
                    res.flash('error',err.message);
                    res.redirect('/auth/login');
                    return;
                }
                let userName=result[0]._name;
                if (response) {
                    // res.cookie('isLoggedIn',true);
                    req.flash('userName',userName);
                    if(role==="users"){
                        res.redirect('/user');
                    }else if(role==="doctor"){
                        res.redirect('/doctor')
                    }else{
                        res.redirect('/shopOwner')
                    }
                } else {
                  // response is OutgoingMessage object that server response http request
                  req.flash('error','Password do not match');
                  res.redirect('/auth/login');
                  return;
                  //   res.flash('error','Passwords do not match');
                }
              });
        })
    } catch (err) {
        res.flash('error',err.message);
        res.redirect('/auth/login');
        return;
    }
}

function forgotPasswordGet(req,res){
    let message=req.flash('error');
    res.render('forgotPassword',{message});
}

function forgotPasswordPost(req,res){
    let {role,email}=req.body;
    let sql='select * from '+role+' where _email=?';
    medilabDatabase.query(sql,[email],(err,result)=>{
        if(err){
            throw err;
        }
        if(result.length==0){
            req.flash('error',"No such user exist");
            res.redirect('/auth/forgotPassword');
            return;
        }
        // user exit and create a one time link valid for a certain period
        let email=result[0]._email;
        let id;
        if(role==="users"){
            id=result[0]._uid;
        }else if(role==="doctor"){
            id=result[0]._did;
        }else{
            id=result[0]._oid;
        }
        let name=result[0]._name;
        let dbPassword=result[0]._password;
        const secret=JWT_SECRET+dbPassword;

        const payload={
            email,
            id
        };

        const token=jwt.sign(payload,secret,{expiresIn:'15m'});

        const link=`http://localhost:3000/auth/resetPassword/${id}/${role}/${token}`;
        sendMailUtil(email,"Reset Password for medilab",`Hello ${name},\nThis is your One Time link to reset password for your account at medilab.\n\n${link}\n\nIgnore this message if you have not generated this link.\n\nThis Link Expires in 15 min.`)
        res.send('password link has been sent to your email....');
    })
}

function resetPasswordGet(req,res){
    try {
        const {id,role,token}=req.params;
        let strId;
        if(role==="users"){
            strId='_uid';
        }else if(role==="doctor"){
            strId='_did';
        }else{
            strId='_oid';
        }
        let sql='select * from '+role+' where '+strId+'=?';
        medilabDatabase.query(sql,[id],(err,result)=>{
            if(err){
                throw err;
            }
            // check if id exist or not
            if(result.length==0){
                res.send("You don't have acces to this page");
                return;
            }
            let email=result[0]._email;
            let dbPassword=result[0]._password;
            const secret=JWT_SECRET+dbPassword;
            const payload=jwt.verify(token,secret);
            let message=req.flash('error');
            res.render('resetPassword',{email:email,message:message});
        });
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
}

async function resetPasswordPost(req,res){
    try {
        const {id,role,token}=req.params;
        let {password,confirmPassword}=req.body;
        let isValid=schema.validate(password,{list:true});
        if(isValid.length>0){
            let message = isValid.map((elem)=>{
                return passwordErrorsMessages[elem];
            })
            message=''.concat(...message);
            req.flash('error',message);
            res.redirect(`/auth/resetPassword/${id}/${role}/${token}`);
            return;
        }
        if(password!==confirmPassword){
            req.flash('error','Password and Confirm Password do not match');
            res.redirect(`/auth/resetPassword/${id}/${role}/${token}`);
            return;
        }
        let strId;
        if(role==="users"){
            strId='_uid';
        }else if(role==="doctor"){
            strId='_did';
        }else{
            strId='_oid';
        }
        let salt=await bcrypt.genSalt(10);
        let hash=await bcrypt.hash(password,salt);
        password=hash;
        let sql='select * from '+role+' where '+strId+'=?';
        medilabDatabase.query(sql,[id],(err,result)=>{
            if(err){
                throw err;
            }
            // check if id exist or not
            if(result.length==0){
                res.send("You don't have acces to this page");
                return;
            }
            let email=result[0]._email;
            let dbPassword=result[0]._password;
            const secret=JWT_SECRET+dbPassword;
            const payload=jwt.verify(token,secret);
            let sqlUpdate='update '+role+' set _password=? where _email=?';
            medilabDatabase.query(sqlUpdate,[password,email],(err,result)=>{
                if(err){
                    throw err;
                }
                res.redirect('/auth/login');
            })
        });
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
}



module.exports={
    loginGet,
    loginPost,
    forgotPasswordGet,
    forgotPasswordPost,
    resetPasswordGet,
    resetPasswordPost
}
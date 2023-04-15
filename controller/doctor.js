const medilabDatabse=require('../models/db');
const bcrypt=require("bcrypt");
const {sendMailUtil,passwordCheck,schema,passwordErrorsMessages,uploadFile}=require('./utilityFunctions');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config');
const path=require('path');

// doctor register

function doctorGet(req,res){
    let message=req.flash('error');
    res.render('doctorRegister',{message});
}

async function doctorPost(req,res){
    try {
        let {name,email,password,mci,mobNumber,sa,city,pa}=req.body;
        let address=sa+"^"+city+"^"+pa;
        let isValid=schema.validate(password,{list:true});
        if(isValid.length>0){
            let message = isValid.map((elem)=>{
                return passwordErrorsMessages[elem];
            })
            message=''.concat(...message);
            req.flash('error',message);
            res.redirect('/auth/doctorRegister');
            return;
        }
        let salt=await bcrypt.genSalt(10);
        let hash=await bcrypt.hash(password,salt);
        password=hash;
        let sql='insert into doctor(_mci,_password,_address,_email,_name,_phno) values(?,?,?,?,?,?);';
        medilabDatabse.query(sql,[mci,password,address,email,name,mobNumber],(err,result)=>{
            if(err){
                req.flash('error','email '+email+' already exist');
                res.redirect('/auth/doctorRegister');
                return;
            }
            sendMailUtil(email,'Registered to Medilab',`Hello ${name}, Welcome to Medilab.\nThank You for registering to our website.`)
            res.redirect('/auth/login');
        });
    } catch (error) {
        res.status(500).send('Server Error. Try after some time.')

    }
    
}


// doctor home page


function doctorHome(req,res){
    res.render('doctor');
}

// article composing section

function composeGet(req,res){
    res.render('compose');
}

function composePost(req,res){
    try {
        let {blogtitle,blogcontent}=req.body;
        let blogimage=req.files.blogimage;
        let token=req.cookies.jwt;
        jwt.verify(token,JWT_SECRET,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/auth/login');
            }
            let email=decodedToken.email;
            let sql='select * from doctor where _email=?';
            medilabDatabse.query(sql,[email],(err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500).send('Server Error. Try after some time.')
                }
                let doctorId=result[0]._did;
                // console.log(blogtitle,blogimage,blogcontent,email,doctorId);
                uploadFile(blogtitle,blogcontent,blogimage,doctorId);
                res.redirect('/doctor');
            })
        })
    } catch (error) {
        console.log(err);
        res.status(500).send('Server Error. Try after some time.');
    }
    

}

function doctorArticleGet(req,res){
    let token=req.cookies.jwt;
    jwt.verify(token,JWT_SECRET,(err,decodedToken)=>{
        if(err){
            console.log(err);
            res.send(500).send("server error. try after some time.")
        }
        let email=decodedToken.email;
        let sql='select * from doctor where _email=?';
        medilabDatabse.query(sql,[email],(err,result)=>{
            if(err){
                res.send(500).send("server error. try after some time.");
            }
            let doctorId=result[0]._did;
            let sql='select * from blog where _did=?';
            medilabDatabse.query(sql,[doctorId],(err,articles)=>{
                if(err){
                    res.send(500).send("server error. try after some time.");
                }
                res.render('doctorBlog',{articles});
            })
        })
    })
}



module.exports={
    doctorGet,
    doctorPost,
    doctorHome,
    composeGet,
    composePost,
    doctorArticleGet
}
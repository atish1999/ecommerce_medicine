const medilabDatabase=require('../models/db');
const bcrypt=require("bcrypt");
const {sendMail,passwordCheck,schema,passwordErrorsMessages}=require('./utilityFunctions');


function userGet(req,res){
    let message=req.flash('error');
    res.render('userRegister',{message});
}

async function userPost(req,res){
    let {name,email,password,mobNumber,pa,sa,city}=req.body;
    let address=sa+"^"+city+"^"+pa;
    let isValid=schema.validate(password,{list:true});
    if(isValid.length>0){
        let message = isValid.map((elem)=>{
            return passwordErrorsMessages[elem];
        })
        message=''.concat(...message);
        req.flash('error',message);
        res.redirect('/auth/userRegister');
        return;
    }
    let salt=await bcrypt.genSalt(10);
    let hash=await bcrypt.hash(password,salt);
    password=hash;
    sendMail(email,'Registered to Medilab',`Hello ${name}, Welcome to Medilab\n.Thank You for registering to our website.`)
    let sql='insert into users(_password,_address,_email,_name,_phno) values(?,?,?,?,?);';
    medilabDatabase.query(sql,[password,address,email,name,mobNumber],(err,result)=>{
        if(err){
            throw err;
        }
        res.redirect('/auth/login');
    })
}

function userHome(req,res){
    res.render('user');
}

module.exports={
    userGet,
    userPost,
    userHome
}
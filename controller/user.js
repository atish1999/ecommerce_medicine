const medilabDatabase=require('../models/db');
const bcrypt=require("bcrypt");
const sendMail=require('./mailer');

function userGet(req,res){
    res.render('userRegister');
}

async function userPost(req,res){
    let {name,email,password,mobNumber,pa,sa,city}=req.body;
    let address=sa+"^"+city+"^"+pa;
    let salt=await bcrypt.genSalt(10);
    let hash=await bcrypt.hash(password,salt);
    password=hash;
    sendMail(email,'Registered to Medilab',`Hello ${name}, Welcome to Medilab.\n Thank You for registering to our website.`)
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
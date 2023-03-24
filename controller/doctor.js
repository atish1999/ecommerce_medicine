const medilabDatabse=require('../models/db');
const bcrypt=require("bcrypt");
const sendMail=require('./mailer');

function doctorGet(req,res){
    res.render('doctorRegister');
}

async function doctorPost(req,res){
    let {name,email,password,mci,mobNumber,sa,city,pa}=req.body;
    let address=sa+"^"+city+"^"+pa;
    let salt=await bcrypt.genSalt(10);
    let hash=await bcrypt.hash(password,salt);
    password=hash;
    sendMail(email,'Registered to Medilab',"Welcome to Medilab.\n Thankyou for registering to our website.")
    let sql='insert into doctor(_mci,_password,_address,_email,_name,_phno) values(?,?,?,?,?,?);';
    medilabDatabse.query(sql,[mci,password,address,email,name,mobNumber],(err,result)=>{
        if(err){
            throw err;
        }
        res.redirect('/auth/login');
    });
}

function doctorHome(req,res){
    res.render('doctor');
}

module.exports={
    doctorGet,
    doctorPost,
    doctorHome
}
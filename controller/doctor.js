const medilabDatabse=require('../models/db');
const bcrypt=require("bcrypt");
const {sendMailUtil,passwordCheck,schema,passwordErrorsMessages}=require('./utilityFunctions');


function doctorGet(req,res){
    let message=req.flash('error');
    res.render('doctorRegister',{message});
}

async function doctorPost(req,res){
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
    sendMailUtil(email,'Registered to Medilab',`Hello ${name}, Welcome to Medilab.\nThank You for registering to our website.`)
    let sql='insert into doctor(_mci,_password,_address,_email,_name,_phno) values(?,?,?,?,?,?);';
    medilabDatabse.query(sql,[mci,password,address,email,name,mobNumber],(err,result)=>{
        if(err){
            throw err;
        }
        res.redirect('/auth/login');
    });
}

function doctorHome(req,res){
    let userName=req.flash('userName');
    res.render('doctor',{userName});
}

module.exports={
    doctorGet,
    doctorPost,
    doctorHome
}
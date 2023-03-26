const medilabDatabase=require('../models/db');
const bcrypt=require('bcrypt');
const {sendMailUtil,passwordCheck,schema,passwordErrorsMessages}=require('./utilityFunctions');

function shopOwnerGet(req,res){
    let message=req.flash('error');
    res.render('shopOwnerRegister',{message});
}

async function shopOwnerPost(req,res){
    let {name,email,password,pci,mobNumber,sa,city,pa}=req.body;
    let address=sa+"^"+city+"^"+pa;
    let isValid=schema.validate(password,{list:true});
    if(isValid.length>0){
        let message = isValid.map((elem)=>{
            return passwordErrorsMessages[elem];
        })
        message=''.concat(...message);
        req.flash('error',message);
        res.redirect('/auth/shopOwnerRegister');
        return;
    }
    let salt=await bcrypt.genSalt(10);
    let hash=await bcrypt.hash(password,salt);
    password=hash;
    sendMailUtil(email,'Registered to Medilab',"Welcome to Medilab.\nThankyou for registering to our website.")
    let sql='insert into shopowner(_pci,_password,_address,_email,_name,_phno) values(?,?,?,?,?,?);';
    medilabDatabase.query(sql,[pci,password,address,email,name,mobNumber],(err,result)=>{
        if(err){
            throw err;
        }
        res.redirect('/auth/login');
    })
}

function shopOwnerHome(req,res){
    res.render('shopOwner');
}

module.exports={
    shopOwnerGet,
    shopOwnerPost,
    shopOwnerHome
}
const medilabDatabase=require('../models/db');
const bcrypt=require('bcrypt');
const {sendMailUtil,passwordCheck,schema,passwordErrorsMessages}=require('./utilityFunctions');

// shop owner register

function shopOwnerGet(req,res){
    let message=req.flash('error');
    res.render('shopOwnerRegister',{message});
}

async function shopOwnerPost(req,res){
    try {
        let {name,email,password,shopname,pci,mobNumber,sa,city,pa}=req.body;
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
        let sql='insert into shopowner(_shopname,_pci,_password,_address,_email,_name,_phno) values(?,?,?,?,?,?,?);';
        medilabDatabase.query(sql,[shopname,pci,password,address,email,name,mobNumber],(err,result)=>{
            if(err){
                console.log(err);
                req.flash('error','email '+email+' already exist');
                res.redirect('/auth/shopOwnerRegister');
                return;
            }
            sendMailUtil(email,'Registered to Medilab',`Hello ${name}, Welcome to Medilab.\nThank You for registering to our website.`)
            res.redirect('/auth/login');
        })
    } catch (error) {
        res.status(500).send('Server Error. Try after some time.')
    }
    
}

// shop owner home page

function shopOwnerHome(req,res){
    let userName=req.flash('userName');
    res.render('shopOwner',{userName});
}

function shopOwnerReportGet(req,res){
    let ownerId=req.params.ownerId;
    console.log(ownerId);
    let sql='select * from transaction where _oid=?';
    medilabDatabase.query(sql,[ownerId],(err,orders)=>{
        if(err){
            res.status(500).send('Server Error. Try after some time.');
            return;
        }
        res.render('shopOwnerReport',{orders})
    })
}

module.exports={
    shopOwnerGet,
    shopOwnerPost,
    shopOwnerHome,
    shopOwnerReportGet
}
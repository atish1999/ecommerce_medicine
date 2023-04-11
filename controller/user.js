const medilabDatabase=require('../models/db');
const bcrypt=require("bcrypt");
const {sendMailUtil,passwordCheck,schema,passwordErrorsMessages}=require('./utilityFunctions');


// user register

function userGet(req,res){
    let message=req.flash('error');
    res.render('userRegister',{message});
}

async function userPost(req,res){
    try {
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
        let sql='insert into users(_password,_address,_email,_name,_phno) values(?,?,?,?,?);';
        medilabDatabase.query(sql,[password,address,email,name,mobNumber],(err,result)=>{
            if(err){
                req.flash('error','email '+email+' already exist');
                res.redirect('/auth/userRegister');
                return;
            }
            sendMailUtil(email,'Registered to Medilab',`Hello ${name}, Welcome to Medilab.\nThank You for registering to our website.`)
            res.redirect('/auth/login');
        })
    } catch (error) {
        res.status(500).send('Server Error. Try after some time.')
    }
    
}

// user home page

function userHome(req,res){
    let userName=req.flash('userName');
    res.render('user',{userName});
}

module.exports={
    userGet,
    userPost,
    userHome
}
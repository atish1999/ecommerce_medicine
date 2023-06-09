const medilabDatabase=require('../models/db');
const bcrypt=require("bcrypt");
const {sendMailUtil,passwordCheck,schema,passwordErrorsMessages,formatDate}=require('./utilityFunctions');


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
    res.render('user');
}

function userArticlesGet(req,res){
    try {
        let sql='select * from blog;'
        medilabDatabase.query(sql,(err,articles)=>{
            if(err){
                res.status(500).send("Server Error. Try after some time.");
                return;
            }
            res.render('userBlog',{articles});
        })
    } catch (error) {
        
    }
    
    
}

function addCartPost(req,res){
    let fullUrl = req.get('referer');
    let inputArr=req.body.button.split("^");
    let productId=inputArr[0];
    let userId=inputArr[1];
    let productImage=inputArr[2];
    let productExpiry=inputArr[3];
    productExpiry=formatDate(productExpiry);
    let productName=inputArr[4];
    let productMrp=inputArr[5];
    let productManufacturer=inputArr[6];
    // console.log(productId,productImage,productExpiry,productName,productMrp,productManufacturer,userId);
    let sql='insert into cart(_prid,_uid,_image,_expiry,_name,_mrp,_manufacturer) values(?,?,?,?,?,?,?);';
    medilabDatabase.query(sql,[productId,userId,productImage,productExpiry,productName,productMrp,productManufacturer],(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send("Server Error. Try after some time.");
            return;
        }
        res.redirect(fullUrl);
    })
}


function myCartGet(req,res){
    let userId=req.params.userId;
    // console.log(userId);
    let sql='select * from cart where _uid=?';
    medilabDatabase.query(sql,[userId],async (err,products)=>{
        if(err){
            res.status(500).send("Server Error. Try after some time.");
            return;
        }
        res.render('myCart',{products})
    })
    
}

function deleteFromCartPost(req,res){
    let cartId=req.body.button;
    let fullUrl = req.get('referer');
    let sql='delete from cart where _cartId=?';
    medilabDatabase.query(sql,[cartId],(err,result)=>{
        if(err){
            res.status(500).send("Server Error. Try after some time.");
            return;
        }
        res.redirect(fullUrl);
    })
}

function userOrderGet(req,res){
    let userId=req.params.userId;
    let sql='select * from transaction where _uid=?';
    medilabDatabase.query(sql,[userId],(err,orders)=>{
        if(err){
            res.status(500).send("Server Error. Try after some time.");
            return;
        }
        res.render('userOrder',{orders});
    })
}


module.exports={
    userGet,
    userPost,
    userHome,
    userArticlesGet,
    addCartPost,
    myCartGet,
    deleteFromCartPost,
    userOrderGet
}
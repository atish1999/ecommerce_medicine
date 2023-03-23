const medilabDatabase=require('../models/db');

function userGet(req,res){
    res.render('userRegister');
}

function userPost(req,res){
    let {name,email,password,mobNumber,pa,sa,city}=req.body;
    let address=sa+"#"+city+"#"+pa;
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
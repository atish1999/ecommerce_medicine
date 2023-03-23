const medilabDatabase=require('../models/db');

function shopOwnerGet(req,res){
    res.render('shopOwnerRegister');
}

function shopOwnerPost(req,res){
    let {name,email,password,pci,mobNumber,sa,city,pa}=req.body;
    let address=sa+"#"+city+"#"+pa;
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
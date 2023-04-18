const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config');
const path=require('path');
const medilabDatabse=require('../models/db');
const bcrypt=require("bcrypt");
const {uploadMedicine}=require('./utilityFunctions');
const fs=require('fs');

function addMedicineGet(req,res){
    res.render('addMedicine');
}

function addMedicinePost(req,res){
try {
    let {name,quantity,mrp,manufacturer,composition,expdate,use,benefits}=req.body;
    let medicineimage=req.files.medicineimage;
    let token=req.cookies.jwt;
    jwt.verify(token,JWT_SECRET,(err,decodedToken)=>{
        if(err){
            console.log(err.message);
            res.redirect('/auth/login');
        }
        let email=decodedToken.email;
        let sql='select * from shopowner where _email=?';
        medilabDatabse.query(sql,[email],(err,result)=>{
            if(err){
                console.log(err);
                res.status(500).send('Server Error. Try after some time.')
            }
            let ownerId=result[0]._oid;
            uploadMedicine(name,quantity,mrp,medicineimage,manufacturer,composition,expdate,use,benefits,ownerId);
            // console.log(name,quantity,mrp,manufacturer,composition,expdate,use,benefits,ownerId);
            res.redirect('/shopOwner');
        })
    })
    } catch (error) {
        
    } 
}

function ownerMedicineStocks(req,res){
    let token=req.cookies.jwt;
    jwt.verify(token,JWT_SECRET,(err,decodedToken)=>{
        if(err){
            console.log(err);
            res.send(500).send("server error. try after some time.")
        }
        let email=decodedToken.email;
        let sql='select * from shopowner where _email=?';
        medilabDatabse.query(sql,[email],(err,result)=>{
            if(err){
                res.send(500).send("server error. try after some time.");
            }
            let ownerId=result[0]._oid;
            let sql='select * from product where _oid=?';
            medilabDatabse.query(sql,[ownerId],(err,medicines)=>{
                if(err){
                    res.send(500).send("server error. try after some time.");
                }
                res.render('ownerMedicineStock',{medicines});
            })
        })
    })
}

function deleteMedicine(req,res){
    let inputArr=req.body.button.split("^");
    let productId=inputArr[0];
    let imageName=inputArr[1];
    let sql='delete from product where _prid=?';
    medilabDatabse.query(sql,[productId],(err,result)=>{
        if(err)
        {
            res.status(500).send("server error. try after some time");
        }
        fs.unlinkSync(path.join(__dirname,'..','/public/uploads',imageName));
        res.redirect('/shopOwner/stocks');
    })
}

module.exports={
    addMedicineGet,
    addMedicinePost,
    ownerMedicineStocks,
    deleteMedicine
}
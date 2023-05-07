const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config');
const path=require('path');
const medilabDatabse=require('../models/db');
const bcrypt=require("bcrypt");
const {uploadMedicine,formatDate,getTodayDate}=require('./utilityFunctions');
const fs=require('fs');
const { type } = require('os');

function addMedicineGet(req,res){
    res.render('addMedicine');
}

function addMedicinePost(req,res){
try {
    let {name,quantity,mrp,tablets,manufacturer,composition,expdate,use,benefits}=req.body;
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
                res.status(500).send('Server Error. Try after some time.');
                return;
            }
            let ownerId=result[0]._oid;
            uploadMedicine(name,quantity,mrp,tablets,medicineimage,manufacturer,composition,expdate,use,benefits,ownerId);
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
            res.send(500).send("server error. try after some time.");
            return;
        }
        let email=decodedToken.email;
        let sql='select * from shopowner where _email=?';
        medilabDatabse.query(sql,[email],(err,result)=>{
            if(err){
                res.send(500).send("server error. try after some time.");
                return;
            }
            let ownerId=result[0]._oid;
            let sql='select * from product where _oid=?';
            medilabDatabse.query(sql,[ownerId],(err,medicines)=>{
                if(err){
                    res.send(500).send("server error. try after some time.");
                    return;
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
            return;
        }
        fs.unlinkSync(path.join(__dirname,'..','/public/uploads',imageName));
        res.redirect('/shopOwner/stocks');
    })
}

function updateMedicineGet(req,res){
    let productId=req.params.productId;
    let sql='select * from product where _prid=?';
    medilabDatabse.query(sql,[productId],(err,product)=>{
        if(err){
            res.status(500).send("server error. try after some time");
            return;
        }
        if(!product[0]._composition.includes(" "))
            product[0]._composition=product[0]._composition.split(" ");
        else
            product[0]._composition=JSON.parse(product[0]._composition);
        // console.log(product[0]._composition);
        // if(typeof product[0]._composition !== "string")
        product[0]._expiry=formatDate(product[0]._expiry.toDateString());
        res.render('updateMedicine',{product});
    })
}

function updateMedicinePost(req,res){
    let productId=req.params.productId;
    let {name,quantity,mrp,tablets,manufacturer,composition,expdate,use,benefits,button}=req.body;
    composition=JSON.stringify(composition);
    let medicineimage=req.files.medicineimage;
    medicineimage.name=Date.now()+medicineimage.name;
    let uploadPath=path.join(__dirname,'..','/public/uploads',medicineimage.name);
    medicineimage.mv(uploadPath,(err)=>{
        if(err)
        {
            console.log(err);
            res.status(400).send("Please enter a valid image");
            return;
        }
        fs.unlinkSync(path.join(__dirname,'..','/public/uploads',button));
        let sql='update product set _name=?, _quantity=?, _mrp=?, _tabletsperPiece=?, _image=?, _manufacturer=?, _composition=?, _expiry=?, _use=?, _benefits=? where _prid=?';
        medilabDatabse.query(sql,[name,quantity,mrp,tablets,medicineimage.name,manufacturer,composition,expdate,use,benefits,productId],(err,result)=>{
            if(err){
                res.status(500).send("Server Error. Try After some time.")
                return;
            }
        
        })
        res.redirect('/shopOwner/stocks');
    })
}

function searchMedicineGet(req,res){
    // console.log(req.url);
    let searchQuery=req.url.split('?')[1];
    let medicinename=searchQuery.split('=')[1];
    let sql="select * from product where _name like '%"+medicinename+"%';";
    medilabDatabse.query(sql,(err,medicines)=>{
        if(err){
            console.log(err);
            res.status(500).send("Server Error. Try After some time.");
            return;
        }
        let medicinesError="";
        if(medicines.length==0)
            medicinesError="No Such Medicine Exit";
        res.render('userMedicine',{medicines,medicinesError});
    })
}

function productGet(req,res){
    let productId=req.params.productId;
    let sql='select * from product where _prid=?';
    medilabDatabse.query(sql,[productId],(err,product)=>{
        if(err){
            console.log(err);
            res.status(500).send("Server Error. Try After some time.");
            return;
        }
        if(!product[0]._composition.includes(" "))
            product[0]._composition=product[0]._composition.split(" ");
        else
            product[0]._composition=JSON.parse(product[0]._composition);
        res.render('medicineProduct',{product});
    })
}

function buyMedicineGet(req,res){
    let url=decodeURIComponent(req.url);
    let searchQuery=url.split('?');
    let queries=searchQuery[1].split('&');
    let quantity=queries[0].split('=')[1];
    let idQuery=queries[1].split('=')[1];
    let ids=idQuery.split('^');
    let userId=ids[0];
    let productId=ids[1];
    let ownerId=ids[2];
    // console.log(quantity,userId,productId,ownerId);
    let sql='select * from product where _prid=?';
    medilabDatabse.query(sql,[productId],(err,product)=>{
        if(err){
            console.log(err);
            res.status(500).send("Server Error. Try After some time.");
            return;
        }
        // will handle it later
        if(quantity>product[0]._quantity){
            let message='Quantity is more than available quantity';
            res.locals.message=message;
            if(!product[0]._composition.includes(" "))
                product[0]._composition=product[0]._composition.split(" ");
            else
                product[0]._composition=JSON.parse(product[0]._composition);
            res.render('medicineProduct',{product});
            return;
        }
        let price=product[0]._mrp*quantity;
        res.render('buyMedicine',{product,quantity,price});
    })
}

function purchaseProductPost(req,res){
    let purchaseMedicine=req.body.purchaseMedicine.split('^');
    let userId=purchaseMedicine[0];
    let productId=purchaseMedicine[1];
    let ownerId=purchaseMedicine[2];
    let quantity=purchaseMedicine[3];
    let name=purchaseMedicine[4];
    let price=purchaseMedicine[5];
    let manufacturer=purchaseMedicine[6];
    let oldQuantiy=purchaseMedicine[7];
    let image=purchaseMedicine[8];
    let date=getTodayDate();
    let status='pending';
    let sql='insert into transaction(_uid,_oid,_prid,_date,_quantity,_name,_price,_manufacturer,_status,_image) values(?,?,?,?,?,?,?,?,?,?);';
    medilabDatabse.query(sql,[userId,ownerId,productId,date,quantity,name,price,manufacturer,status,image],(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send("Server Error. Try After some time.");
            return;
        }
        let sql='update product set _quantity=?-? where _prid=?';
        medilabDatabse.query(sql,[oldQuantiy,quantity,productId],(err,result)=>{
            if(err){
                console.log(err);
                res.status(500).send("Server Error. Try After some time.");
                return;
            }
            res.redirect('/user');
        })
    })
}


module.exports={
    addMedicineGet,
    addMedicinePost,
    ownerMedicineStocks,
    deleteMedicine,
    updateMedicineGet,
    updateMedicinePost,
    searchMedicineGet,
    productGet,
    buyMedicineGet,
    purchaseProductPost
}
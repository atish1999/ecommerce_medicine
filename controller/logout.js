const jwt=require('jsonwebtoken');

function logoutGet(req,res){
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}

module.exports=logoutGet;
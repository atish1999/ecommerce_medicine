const jwt=require('jsonwebtoken');

// logout

function logoutGet(req,res){
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}

module.exports=logoutGet;
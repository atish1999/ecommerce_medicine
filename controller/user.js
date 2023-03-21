function userGet(req,res){
    res.render('userRegister');
}

function userPost(req,res){
    let {name,email,password,mobNumber,address}=req.body;
    console.log(name,email,password,mobNumber,address);
    // save this data to backend
    res.redirect('/auth/login');
}

function userHome(req,res){
    res.render('user');
}

module.exports={
    userGet,
    userPost,
    userHome
}
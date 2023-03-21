function doctorGet(req,res){
    res.render('doctorRegister');
}

function doctorPost(req,res){
    let {name,email,password,mci,mobNumber,address}=req.body;
    console.log(name,email,password,mci,mobNumber,address);
    // save this data to backend 
    res.redirect('/auth/login');
}

function doctorHome(req,res){
    res.render('doctor');
}

module.exports={
    doctorGet,
    doctorPost,
    doctorHome
}
const {DB}=require('../config');
const mysql=require("mysql");

const medilabDatabse=mysql.createConnection({
    host:DB.host,
    user:DB.user,
    password:DB.password,
    database:DB.database
});

medilabDatabse.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('connected to the database');
})

module.exports=medilabDatabse;
PORT=process.env.PORT || 3000;

const DB = {
    host: 'localhost',
    user: 'amish',
    password: 'aks32216',
    database: 'medilab'
};

module.exports={
    PORT,
    DB
}
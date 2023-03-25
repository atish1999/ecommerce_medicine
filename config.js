PORT=process.env.PORT || 3000;

const DB = {
    host: 'localhost',
    user: 'amish',
    password: 'aks32216',
    database: 'medilab'
};

const SECRET="flsjishgjsujwiskhfyeh";

module.exports={
    PORT,
    DB,
    SECRET
}
PORT=process.env.PORT || 3000;

// add database configuration in the env file
const DB = {
    host: 'localhost',
    user: 'amish',
    password: 'aks32216',
    database: 'medilab'
};

const SECRET="flsjishgjsujwiskhfyeh";
const JWT_SECRET="thisissecretforjsonwebtoken";

module.exports={
    PORT,
    DB,
    SECRET,
    JWT_SECRET
}
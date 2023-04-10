const express=require("express");
const cookieParser=require('cookie-parser');
const session=require('express-session');
const flash=require('connect-flash');
const fileupload=require('express-fileupload');
const app=express();
require('dotenv').config();
const {PORT,SECRET}=require("./config");
const router=require("./routes/index");
const {checkUser}=require('./controller/utilityFunctions');


app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(cookieParser(SECRET));
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 60 }
}));
app.use(flash());
app.use(fileupload());

app.get('*',checkUser);

app.all('/', (req, res) => {
    res.render('home');
});

app.use('/', router);

// url not found
app.use((req, res) => {
    res.status(404);
    res.format({
        html () {
        res.render('404', { url: `${req.headers.host}${req.url}` });
        },
        json () {
        res.json({ error: 'Not found', errorCode: 404 });
        },
        default () {
        res.type('txt').send('Error (404): File not found');
        }
    });
});

app.listen(PORT,()=>{
    console.log(`Server Started on port ${PORT}`);
})
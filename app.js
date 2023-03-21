const express=require("express");
const app=express();
require('dotenv').config();
const {PORT}=require("./config");
const router=require("./routes/index")

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

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

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();

app.use(session({secret: 'war43',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

var sess; // global session, NOT recommended

var sesval;

router.get('/',(req,res) => {
    sess = req.session;
    if(sess.email) {
        return res.redirect('/admin');
    }
    res.sendFile('index.html');
});


router.post('/login',(req,res) => {
    sess = req.session;
    sess.email = req.body.email;
    sesval = "done";
    res.sendFile(__dirname + '/views/dashboard/index.html');

});


router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

app.use('/', router);

app.listen(process.env.PORT || 3000,() => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();

app.use(express.urlencoded());

app.use(session({secret: 'war43',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

var sess; // global session, NOT recommended

var sesval;

var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : "localhost",
    user     : "root",
    password : "1234",
    port     : "3306",
    database : "guideme2_0"
});

connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
    });


router.post('/login',(req,res) => {
    sess = req.session;
    sess.email = req.body.email;
    sesval = "done";
    var email = req.body.email;
    var pass = req.body.password;
    connection.query('SELECT * FROM accounts WHERE emailid = ? AND password = ?', [email, pass], function (err, result) {
        if (err) throw err;
        console.log("results  = " + result);
        if(result)
        {
            res.sendFile(__dirname + '/views/dashboard/student.html');
        }
        console.log("Login Transfered");
      });
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
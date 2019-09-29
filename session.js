const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
var mysql = require('mysql');

const router = express.Router();
const app = express();
app.use(express.urlencoded());

app.use(session({secret: 'war43',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

app.set('view engine', 'ejs');

var sess; 
var sesval;

var connection = mysql.createConnection({
    host     : "localhost",
    user     : "root",
    password : "",
    port     : "3306",
    database : ""
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
    var flag = null;

    connection.query('SELECT * FROM accounts WHERE emailid = ? AND password = ?', [email, pass], function (err, result) {
        if (err) throw err;
        console.log("results  = " + result);
        if(result != '')
        {
            flag = 1;
        }
        else
        {
            res.send("Please verify your credentials");
        }
        console.log("Login Transfered");

        if(flag == 1)
        {
            var uname = null;
            var uid = 0;
            var roll = null;
            connection.query('SELECT UID, username FROM accounts WHERE emailid = ?', [email], function (err, result) 
            {
                if (err) throw err;
                uname = result[0].username;
                uid = result[0].UID;
                console.log("uname is = " + uname);
                console.log("uname is = " + uid);


                // Getting roll number from students table
                connection.query('SELECT rollno FROM students WHERE UID = ?', [uid], function (err, result) 
                {
                    if (err) throw err;
                    roll = result[0].rollno;
                    console.log("roll is = " + roll);
                    res.render(__dirname + '/views/dashboard/student.ejs', {username: uname, roll: roll})
                });
            });

        }
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
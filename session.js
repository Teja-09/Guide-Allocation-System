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
    password : "1234",
    port     : "3306",
    database : "guideme_final"
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


    // var uid = 0, uname = null, roll= null, skillset = null;
    connection.query('SELECT UID FROM accounts WHERE emailid = ? AND password = ?', [email, pass], function (err, result) {
        if (err) throw err;
        // console.log("results  = " + result);
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
            // Student login values
            var uid = 0, name = null, roll= null, skillset = null,username = null;

            // faculty
            noofprojects = 0, yrsofexp = 0;
            connection.query('SELECT UID,name,username FROM accounts WHERE emailid = ?', [email], function (err, result) 
            {
                if (err) throw err;
                uid = result[0].UID;
                name = result[0].name;
                username = result[0].username;
                console.log("uid is = " + uid);
                console.log("name is = " + name);

                connection.query('SELECT rollno,skillset FROM students WHERE SID = ?', [uid], function (err, result) 
                {
                    if(result != '')
                    {
                        if (err) throw err;
                        roll = result[0].rollno;
                        skillset = result[0].skillset;
                        console.log("roll is = " + roll);
                        console.log("skillset  is = " + skillset);
                        connection.query('select distinct accounts.usertype, accounts.name from worksUnder, accounts where accounts.UID in (select SID from worksUnder where FID = (select FID from worksUnder where SID = ?)) or accounts.UID in (select FID from worksUnder where SID = ?);',[uid ,uid],function(err,result)
                        {
                            let teammates = {}
                            let count = 0;
                            let k = 0;
                            result.forEach(() => {
                                if (result[`${count}`].usertype) {
                                    teammates[`${k}`] = result[count].name;
                                    k++;
                                } else {
                                    teammates['4'] = result[count].name;
                                }
                                count++;

                            })
                            console.log(JSON.stringify(teammates));
                            res.render(__dirname + '/views/dashboard/student.ejs', {username: username,name: name, roll: roll, skillset:skillset, teammates: teammates})
                        })
                    }
                    else
                    {
                        connection.query('select skillset,yearsofexp from faculties where FID = ? ',[uid], function(err,result)
                        {
                            if(result != '')
                            {
                                skillset = result[0].skillset;
                                yrsofexp = result[0].yearsofexp;
                                console.log("noof projects " + noofprojects);
                                console.log("yrso of exp  " + yrsofexp);
                                res.render(__dirname + '/views/dashboard/faculty.ejs', {uid:uid ,name: name, skillset: skillset, experience:yrsofexp})
                            }
                            else
                            {
                                connection.query('select usertype from accounts where UID = ?', [uid], function(err, result)
                                {
                                    if(result[0].usertype === 'A')
                                    {
                                        res.render(__dirname + '/views/dashboard/admin.ejs', {uid:uid ,name: name});

                                    }
                                });
                            }
                          
                        })
                    }
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
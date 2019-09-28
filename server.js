var express = require('express');
var app = express();

app.use(express.urlencoded());

var mysql = require('mysql');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html')
  })

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


// ===========================================================================

// SIGNUP post method

app.post('/signup',function(req,res){
    // accounts table
    var name = null;
    var uname = req.body.uname;
    var pass = req.body.password;
    var yearofjoin = 0;
    var phoneno = 0;
    var email = req.body.email;

    // students table
    var student = req.body.student; // check box
    var rollno = req.body.rollno;
    var skillset = null, department = null, degree = null;

    // faculties table
    var faculty = req.body.faculty; // check box
    var designation = req.body.designation;
    var qualification = null;
    var yearsofexp = 0, noofprojects = 0;

    // console.log(student);

    var sql = "INSERT INTO accounts (name, username, password, yearofjoin, phoneno, emailid) VALUES ('"+name+"','"+uname+"','"+pass+"','"+yearofjoin+"','"+phoneno+"','"+email+"')";
    connection.query(sql, function (err, result) 
    {
        if (err) throw err;
        console.log("INserted into accounts table.");
        res.sendFile(__dirname + '/views/index.html');
    }); 

    var uid = 0;
    connection.query('SELECT UID FROM accounts WHERE username = ? AND password = ?', [uname, pass], function (err, result) {
        if (err) throw err;
        uid = JSON.stringify(result[0].UID);
      });
 
    if(rollno != null && student!=undefined)
    {
        setTimeout(function() 
        {

                connection.query("INSERT INTO students (UID, rollno, skillset, department, degree) VALUES ('"+uid+"','"+rollno+"','"+skillset+"','"+department+"','"+degree+"')", function (err, result) 
                {
                    if (err) throw err;
                    console.log("Inserted into students table");
                    console.log("uid = " + uid);
                }); 

        }, 500);
    }
    
    if(designation != null && faculty!=undefined)
    {
        setTimeout(function() 
        {
            connection.query("INSERT INTO faculties (UID, qualification, designation, yearsofexp, noofprojects) VALUES ('"+uid+"','"+qualification+"','"+designation+"','"+yearsofexp+"','"+noofprojects+"')", function (err, result) 
            {
                if (err) throw err;
                console.log("Inserted into faculties table");
                console.log("uid = " + uid);
            }); 
            
        }, 500);
    }
    console.log("Insertion is successful");
});

// ========================================================================================

app.listen(8000);
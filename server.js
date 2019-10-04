var express = require('express');
var app = express();

app.use(express.urlencoded());
var mysql = require('mysql');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html')
  })

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

    var sql = "INSERT INTO accounts (name, username, password, yearofjoin, phoneno, emailid) VALUES ('"+name+"','"+uname+"','"+pass+"','"+yearofjoin+"','"+phoneno+"','"+email+"')";
    connection.query(sql, function (err, result) 
    {
        if (err) throw err;
        console.log("INserted into accounts table.");
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
                // Second form for student signup
                res.render(__dirname+'/views/ejs/stu_index.ejs',{uname:uname});
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
                // Second form for faculty signup
                res.render(__dirname+'/views/ejs/fac_index.ejs',{uname:uname, uid:uid});
            }); 
            
        }, 500);
    }
    console.log("Insertion is successful");
});

// ========================================================================================

    //STUDENT SIGNUP
app.post('/student_signup',function(req,res)
{
    var uname = req.body.uname;
    var name = req.body.name;
    var yearofjoin = req.body.yearofjoin;
    var phoneno = req.body.phoneno;
    var degree = req.body.Degree;
    var department = req.body.department;
    var skillset = req.body.Skillset;
    var link = __dirname+'/views/update/student.html';

    var sql = "UPDATE accounts SET name = '"+name+"', yearofjoin = '"+yearofjoin+"', phoneno = '"+phoneno+"' where username = '"+uname+"'";
    connection.query(sql, function (err, result) 
    {
        if (err) throw err;
        console.log("accounts table updated.");
    }); 

    var uid = 0;
    var rollno = null;
    var name = null;
    connection.query('SELECT UID,name FROM accounts WHERE username = ?', [uname], function (err, result) {
        if (err) throw err;
        uid = JSON.stringify(result[0].UID);
        name = result[0].name;
        console.log("uid = " + uid)

        var sql2 = "UPDATE students SET skillset = '"+skillset+"', department = '"+department+"', degree = '"+degree+"' where UID = '"+uid+"'";
        connection.query(sql2, function (err, result) 
        {
            if (err) throw err;
            console.log("students table updated");
            connection.query('SELECT rollno FROM students WHERE UID = ?', [uid], function (err, result) 
            {
                if (err) throw err;
                rollno = result[0].rollno;
                // rendering the student dashboard.
                res.render(__dirname+'/views/dashboard/student.ejs' ,{username: uname, name: name, roll: rollno, skillset:skillset, link:link});
        }); 
        }); 
    });
});

// =====================================================================================================

    // FACULTY SIGNUP.
app.post('/faculty_signup',function(req,res)
{
    var uid = req.body.uid;
    var name = req.body.name;
    var yearofjoin = req.body.yearofjoin;
    var phoneno = req.body.phoneno;
    var qualification = req.body.qualification;
    var experience = req.body.experience;
    var noofprojects = req.body.noofprojects;

    var sql = "UPDATE accounts SET name = '"+name+"', yearofjoin = '"+yearofjoin+"', phoneno = '"+phoneno+"' where UID = '"+uid+"'";
    connection.query(sql, function (err, result) 
    {
        if (err) throw err;
        console.log("accounts table updated.");
    }); 

    var sql2 = "UPDATE faculties SET qualification = '"+qualification+"', yearsofexp = '"+experience+"', noofprojects = '"+noofprojects+"' where UID = '"+uid+"'";
    connection.query(sql2, function (err, result) 
    {
        if (err) throw err;
        console.log("faculties table updated");
        res.render(__dirname+'/views/dashboard/faculty.ejs' ,{uid: uid, name:name, noofprojects:noofprojects, experience:experience});
    }); 
});


app.post('/student_update',function(req,res)
{
    res.sendFile(__dirname+'/views/update/student.html');
});

app.post('/faculty_update',function(req,res)
{
    res.sendFile(__dirname+'/views/update/faculty.html');
})
app.listen(8000);
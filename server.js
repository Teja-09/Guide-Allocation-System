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
    database : "guideme_final"
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
    var usertype = null;
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

    var sql = "INSERT INTO accounts (name, username, password, usertype, phoneno, emailid) VALUES ('"+name+"','"+uname+"','"+pass+"','"+usertype+"','"+phoneno+"','"+email+"')";
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
    
    var teammates = null;
    var CGPA = 0, assigned = null;
    if(rollno != null && student!=undefined)
    {
        setTimeout(function() 
        {
            connection.query("UPDATE accounts SET usertype='S' where username = '"+uname+"'",function(err,result)
            {
                if (err) throw err;
                console.log("UPdate usertype in acclounts successful");
            })
            connection.query("INSERT INTO students (SID, rollno, CGPA, skillset, department, degree, assigned) VALUES ('"+uid+"','"+rollno+"','"+CGPA+"','"+skillset+"','"+department+"','"+degree+"', '"+assigned+"')", function (err, result) 
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
            connection.query("UPDATE accounts SET usertype='F' where username = '"+uname+"'",function(err,result)
            {
                if (err) throw err;
                console.log("UPdate usertype in accounts successful");
            })
            connection.query("INSERT INTO faculties (FID, skillset, qualification, designation, yearsofexp, assigned) VALUES ('"+uid+"', '"+skillset+"','"+qualification+"','"+designation+"','"+yearsofexp+"','"+assigned+"')", function (err, result) 
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
    var phoneno = req.body.phoneno;
    var degree = req.body.Degree;
    var department = req.body.department;
    var skillset = req.body.Skillset;
    var CGPA = req.body.cgpa;
    var link = __dirname+'/views/update/student.html';

    var sql = "UPDATE accounts SET name = '"+name+"', phoneno = '"+phoneno+"' where username = '"+uname+"'";
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

        var sql2 = "UPDATE students SET skillset = '"+skillset+"', department = '"+department+"', degree = '"+degree+"', CGPA = '"+CGPA+"' where SID = '"+uid+"'";
        connection.query(sql2, function (err, result) 
        {
            if (err) throw err;
            console.log("students table updated");
            connection.query('SELECT rollno FROM students WHERE SID = ?', [uid], function (err, result) 
            {
                if (err) throw err;
                rollno = result[0].rollno;
                // rendering the student dashboard.
                // res.render(__dirname+'/views/index.html' ,{username: uname, name: name, roll: rollno, skillset:skillset, link:link});
                res.sendfile(__dirname+'/views/index.html');
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
    var phoneno = req.body.phoneno;
    var qualification = req.body.qualification;
    var experience = req.body.experience;
    var skillset = req.body.skillset;

    var sql = "UPDATE accounts SET name = '"+name+"', phoneno = '"+phoneno+"' where UID = '"+uid+"'";
    connection.query(sql, function (err, result) 
    {
        if (err) throw err;
        console.log("accounts table updated.");
    }); 

    var sql2 = "UPDATE faculties SET qualification = '"+qualification+"', yearsofexp = '"+experience+"', skillset = '"+skillset+"' where FID = '"+uid+"'";
    connection.query(sql2, function (err, result) 
    {
        if (err) throw err;
        console.log("faculties table updated");
        res.render(__dirname+'/views/dashboard/faculty.ejs' ,{uid: uid, name:name, skillset:skillset, experience:experience});
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

app.post('/admin', function(req,res)
{
    let studentTable = 'students';
    let studentDetails = ['SID', 'skillset', 'CGPA']
    // sid ---> skillset ---> cgpa
    let studentMap = new Object();

    let facultyTable = 'faculties';
    let facultyDetails = ['FID', 'skillset'];
    // fid ---> skillset
    let facultyMap = new Object();

    let worksTable = 'worksUnder';

    let skillGrouping = new Object();
    let groupMap = new Object();

    let sqlstud = `SELECT ${studentDetails[0]}, ${studentDetails[1]}, ${studentDetails[2]} FROM ${studentTable} ORDER BY ${studentDetails[2]} DESC`;
    let sqlfacl = `SELECT ${facultyDetails[0]}, ${facultyDetails[1]} FROM ${facultyTable}`;
    let sqlwork;

    connection.query(sqlstud, (err, results, fields) => {
        if (err) throw err;
        results.forEach(elem => {
            studentMap[elem.SID] = {'CGPA': elem.CGPA, 'skillset': elem.skillset};
        });
        console.log('student details fetched');
        // TODO: add details to student map
        connection.query(sqlfacl, (err, results, fields) => {
            if (err) throw err;
            // TODO: add details to faculty map
            results.forEach(elem => {
                facultyMap[elem.FID] = elem.skillset;
            });
            console.log('faculty details fetched');

            for (let key in studentMap) {
                let studentSkill = studentMap[key].skillset;
                if (!skillGrouping[studentSkill]) {
                    skillGrouping[studentSkill] = new Array();
                }
                skillGrouping[studentSkill].push(key);
            }
            console.log(`skill grouping completed. Result:\n ${JSON.stringify(skillGrouping)}`);

            for (let key in facultyMap) {
                for (let i = 0; i < 4; i++) {
                    let facultySkill = facultyMap[key];
                    if (skillGrouping[facultySkill]) {
                        if (!groupMap[key]) {
                            groupMap[key] = new Array();
                        }
                        let studentWorks = skillGrouping[facultySkill].pop();
                        if (studentWorks) {
                            groupMap[key].push(studentWorks);
                        }
                    }
                }
            }
            console.log(`group Mapping completed. Result:\n ${JSON.stringify(groupMap)}`);
            connection.query(`DELETE FROM ${worksTable}`, (err, result) => {
                if (err) throw err;
                for (let key in groupMap) {
                    let value = groupMap[key];
                    for (let i = 0; i < value.length; i++) {
                        sqlwork = `INSERT INTO ${worksTable} (FID, SID) VALUES ('${parseInt(key)}', '${parseInt(value[i])}')`
                        connection.query(sqlwork, (err, result) => {
                            if (err) throw err;
                            console.log(`Successfully inserted ${key}: ${value[i]}`);
                        });
                    }
                }
                res.send(`<h1>Allocation successful</h1>`);
            });
        });
    });
})
app.listen(8000);
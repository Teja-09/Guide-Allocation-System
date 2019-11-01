const mysql = require('mysql');

const projectAllocation = () => {
    const connection = mysql.createConnection({
        host: "34.73.141.208",
        user: "root",
        password: "calligraphy",
        port: "3306",
        database: "guideme"
    });

    connection.connect(function (err) {
        if (err) {
            console.error('Database connection failed: ' + err.stack);

        }
        console.log('Connected to database.');
    });

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
        // console.log(results);
        // TODO: add details to student map
        connection.query(sqlfacl, (err, results, fields) => {
            if (err) throw err;
            // TODO: add details to faculty map
            results.forEach(elem => {
                facultyMap[elem.FID] = elem.skillset;
            });
            
            console.log('faculty details fetched');
            // console.log(results);

            for (let key in studentMap) {
                let studentSkill = studentMap[key].skillset;
                if (!skillGrouping[studentSkill]) {
                    skillGrouping[studentSkill] = new Array();
                }
                skillGrouping[studentSkill].push(key);
            }
            console.log(`skill grouping completed. Result:\n ${skillGrouping}`);

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
            console.log(`group Mapping completed. Result:\n ${groupMap}`);
            for (let key in groupMap) {
                let value = groupMap[key];
                for (let i = 0; i < 4; i++) {
                    sqlwork = `INSERT INTO ${worksTable} (FID, SID) VALUES ('${key}', '${parseInt(value[i])}')`
                    connection.query(sqlwork, (err, result) => {
                        if (err) throw err;
                        console.log(`Successfully inserted ${key}: ${value[i]}`);
                    });
                }
            }
        });
    });
};

projectAllocation();
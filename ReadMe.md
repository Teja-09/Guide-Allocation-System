# **Welcome to all my friends.**

# This is the documentation of the work that I have done as my part of the project .

## Run server.js and session.js and u can view the landing page in localhost:8000.

### My Part:
- Done with the login and signup details and page routing.
- entering values of users i.e for both student and faculty into the  DB is done.
- I covered all entering and updation of values into accounts, students, and faculties tables.

All the queries for tables are given in tables.txt file. Just copy them into mysql and run.

- **index.html** is the main file.
- Here user selects to login or signup.


# FAQ's
## What happens if he selects to login?
- user will be given a form, where he enters hos email and pasword. 
- This will be checked in "/login"  POST request in session.js file and if the email and password exists in the DB, I goes to the dashboard page.

## what if he selects to SignUp?
- Initially user will be given a form to fill and then as per student or faculty , the user they will be given another form to fill respectively.
- All the deails are taken and finally an ejs dashboard page will be displayed as per student or faculty.

## what POST req does What?
1. ## Firstly in server.js file
- /signup method - This method takes the values from signup form and enters into accounts table and if student is checked and roll number is it will enter values into student table also. or if faculty is checked and designation is entered, it will enter those values into faculties table.

- /student_signup - This is called from 2nd form of student signup, all the values will be taken and it will page will be routed to student.ejs i.e the dashbarrd of student.

- /faculty_signup - This is called from 2nd form of faculty signup, all the values will be taken and it will page will be routed to student.ejs i.e the dashbarrd of faculty.

- /student_update - this is used to update the values of student after signup at some point of time in his life("If he wants to!").

- /faculty_update - The same as above above method but for faculty. For this is UID of faculty will be shown in his/her dashboard.

2. ## session.js
- This is fully used for only login purposes.


# Disclaimer
### All the bugs fixes and issues related to these will be fixed.

## PS:
### Bug has been spotted in Login, as it just goes to student dashboard for now. It will be made generic.


# **Rest of the team members, My work will be done shortly. I have spend hell lot of time on this and no longer wants to. Finish you work and integrate it with this. I am done.**
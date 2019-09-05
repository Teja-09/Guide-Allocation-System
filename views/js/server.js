var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.urlencoded());

//used for logout and main
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
})

// Login post method
app.post('/login',function(req,res){

    var email = req.body.email;
    var password = req.body.password;

    if(email == "ram@gmail.com" && password == "ram")
    {
        res.sendFile(__dirname + '/dashboard/index.html');
    } 
    else
    {
        res.sendFile(__dirname + '/index.html');
    }
});


app.listen(8000);
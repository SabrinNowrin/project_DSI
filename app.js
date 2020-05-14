const express = require('express');
const app = express();
var bcrypt = require('bcrypt');
var path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



var users = {};

// mongoose.set('useCreateIndex', true);
// mongoose.connect(
//     "mongodb+srv://nowrin:nowrin.1001@cluster0-ypdiv.gcp.mongodb.net/test?retryWrites=true&w=majority",
// {
//     useNewUrlParser:true,
//     promiseLibrary:global.Promise 
// });

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'),
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type,Accept,Authorization');
if(req.method ==='OPTIONS'){
     res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
     return res.status(200).json({});
}
next(); 
});
 
app.get('/success',function(req,res){
    res.sendFile(path.join(__dirname + '/Result1.html'));
  
});
app.get('/fail',function(req,res){
    res.sendFile(path.join(__dirname + '/Result2.html'));
});


app.get('/login',function(req,res) {
        //res.sendFile('./index.html');
        res.sendFile(path.join(__dirname + '/Login.html'));
      });
    
 app.post('/login',  async function(req,res){
        
        //var user = {email: req.body.email, password: hashedPassward}
        //users.put(user);
        
        try{       
            if(validateEmail(req.body.email)){
                var salt = await bcrypt.genSalt();
                var hashedPassward = await bcrypt.hash(req.body.psw,salt);
                var user = {"salt": salt,"password": hashedPassward};
                users[req.body.email] = user;
                //console.log("Log valid");
                res.redirect( '/success');
            }
            else{
                res.redirect( '/fail');
            }

        }catch{
            res.status(500).send();
        }
       
    });
   


app.use((req,res,next)=>{
     const error = new Error('Not Found');
     error.status=404;
     next(error);
});

app.use((error,req,res,next)=>{
     res.status(error.status|| 500);
     res.json({
         error:{
             message: error.message
         }
     });
});


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = app; 
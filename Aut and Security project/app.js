//jshint esversion:6
// <---Packages Importing--->
const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const methodOverride = require('method-override');
//for shortcut-icon in browser tab
const favicon = require('serve-favicon');
const path = require('path');
//Hashing package package
const md5=require('md5');


// <---Create instance of express 'app' and adding other package functionalities to 'app'--->
const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride('_method'));
//to implement  shortcut-icon in browser tab 
app.use(express.static(path.join(__dirname, 'public'))); 

// <--- Create database userDB--->
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true,useUnifiedTopology: true});

// <---creating shema--->
const userschema=new mongoose.Schema({
    email:String,
    password:String
});


const User=new mongoose.model("user",userschema);

//Home route
app.route("/")
    .get(function(req,res)
    {
        res.render("home");
    })


//Login Route
app.route("/login")
    .get(function(req,res)
    {
        res.render("login");
    })
    .post(function(req,res){
        User.findOne({email:req.body.username},function(err, user)
        {   

            if(user.password===md5(req.body.password))
            {
                res.render("Secrets");
            }
            else
            {
                console.log(err);
                res.render("login");
            
            }
        })


    })

//Register route
app.route("/register")
    .get(function(req,res)
    {
        res.render("register");
    })
    .post(function(req,res)
    {   
        const u1=new User({
            email:req.body.username,
            password:md5(req.body.password)
        });
        u1.save(function(err)
        {
            if(!err)
            {
                res.render("secrets");
            }
            else{
                console.log(err);
            }
        });

    })

app.listen('3000',function(req,res){
    console.log("app running on port 3000");
})
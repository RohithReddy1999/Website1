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
//Session
var session = require('express-session');
var passport=require('passport');
var passportlocal=require('passport-local');
var passportlocalmongoose=require('passport-local-mongoose');


// <---Create instance of express 'app' and adding other package functionalities to 'app'--->
const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride('_method'));
//to implement  shortcut-icon in browser tab 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(session({
    secret:"Our little secret",
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

// <--- Create database userDB--->
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true,useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);  

// <---creating shema--->
const userschema=new mongoose.Schema({
    email:String,
    password:String
});

userschema.plugin(passportlocalmongoose);

const User=new mongoose.model("user",userschema);


passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Home route
app.route("/")
    .get(function(req,res)
    {
        res.render("home");
    })

// Logout route

app.route("/logout")
    .get(function(req,res)
    {
        req.logout();
        res.redirect("/");
    })



//Login Route
app.route("/login")
    .get(function(req,res)
    {
        res.render("login");
    })
    .post(function(req,res){
        const user=new User({
            username:req.body.username,
            password:req.body.password
        });
        req.login(user,function(err)
        {
            if(err)
            {
                console.log(err);

            }
            else{
                passport.authenticate("local")(req,res,function()
                {
                    res.redirect("/secrets");
                });
            }
        })
              


    })




// Secrets route
app.route("/secrets")
    .get(function(req,res)
    {
        if(req.isAuthenticated())
        {
            res.render("secrets");
        }
        else
        {
            res.redirect("/login");
        }
    })
//Register route
app.route("/register")
    .get(function(req,res)
    {
        res.render("register");
    })
    .post(function(req,res)
    {   
        User.register({username:req.body.username},req.body.password,function(err,user)
        {
            if(err)
            {
                console.log(err);
                res.rendirect("/register");
            }
            else{
                passport.authenticate("local")(req,res,function()
                {
                    res.redirect("/secrets");
                });
            }
        })
        
        
    })

app.listen('3000',function(req,res){
    console.log("app running on port 3000");
})
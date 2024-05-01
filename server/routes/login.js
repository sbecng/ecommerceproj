const express = require("express")
const login__router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const mongodb = require("mongodb")
//connect to mongo db
const login_conn = new mongodb.MongoClient(process.env.DB_URL)
const dbname = process.env.DB_NAME
const tbname = process.env.TABLE

// router.get("/", (req, res) =>{ //set up home route for the application
//     res.render("home")
// })
// login__router.get("/login", (req, res)=>{
//     res.render("login")
// })
login__router.post("/login", async function(req, res) { //set up home route for the application
    const email = req.body.email.trim()
    const pwd = req.body.pwd.trim()
    //validate agianst empty field 
    if(email.length >= 0 || pwd.length >= 0){
        //confirm password for validity
        let user__pwd = await login_conn.db(dbname).collection(tbname).findOne({email:email})
        const user__credentials = req.cookies.jwt

        if(user__pwd){
            // res.render("admin")
            console.log("Display Login Page");

        }else{
            res.send({message:"password mismatched"})
        }
        
    }else{
        res.send({message:"user signon failed"})
    };

})

module.exports = login__router
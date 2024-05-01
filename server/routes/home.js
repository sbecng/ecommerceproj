const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const mongodb = require("mongodb")
//connect to mongo db
const _conn = new mongodb.MongoClient(process.env.DB_URL)
//routes
router.get("/", (req, res) =>{ //set up home route for the application
    res.render("home")
})

router.get("/register", (req, res)=>{
    res.render("register")
})
router.post("/register", async(req, res) =>{ 
    const firstname = req.body.firstname.trim()
    const lastname = req.body.lastname.trim()
    const email = req.body.email.trim()
    const pwd = req.body.pwd.trim()
    const cpwd = req.body.cpwd.trim()
    //validate agianst empty field 
    if(firstname.length >= 0 || lastname.length >= 0 || email.length >= 0 || pwd.length >= 0 || cpwd.length >= 0){
        //confirm password for validity
        if(pwd===cpwd){
            //encript user password 
            bcrypt.hash(pwd, 10).then(async(hash)=>{
               const profile={
                firstname:firstname,
                lastname:lastname,
                email:email,
                pwd:hash
               }
               //insert user data to database
               const feedback = await _conn.db(process.env.DB_NAME).collection(process.env.TABLE).insertOne(profile)
               //generate a jwt token for user login
               if(feedback){
                    const cookie_tokenAge = 3*60*60;
                    //create the user token
                    const token = jwt.sign(profile, "signin",{expiresIn:cookie_tokenAge});
                    //stores the user token in webstorage cookie
                    res.cookie("jwt", token, {
                        httpOnly:true,
                        cookie_tokenAge:cookie_tokenAge*1000
                    });
                    res.render("login")
               }else{
                    res.send({message:"unable to register"})
               }
            })
        }else{
            res.send({message:"password mismatched"})
        }
        
    }else{
        res.send({message:"user registration failed"})
    };

})

router.post("/login", async function(req, res){ //set up home route for the application
    const email = req.body.email.trim()
    const pwd = req.body.pwd.trim()
    //validate agianst empty field 
    if(email.length >= 0 || pwd.length >= 0){
        //confirm password for validity
        let user__pwd = await login_conn.db(dbname).collection(tbname).findOne({email:email})
        const user__credentials = req.cookies.jwt
        if(user__pwd){
            res.send({message:"Display Admin Dashboard"})
            // res.render("admin")
        }else{
            res.send({message:"password mismatched"})
        }
        
    }else{
        res.send({message:"user signon failed"})
    };

})

module.exports = router
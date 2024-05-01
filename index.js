
const dotenv = require("dotenv").config();

//use express engine for the project
const express = require("express")

//create a server application using the express engine
const server = express()
const PORT = process.env.PORT//assign a port to the express application

//require dependencies
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cors = require("cors")
const mongodb = require("mongodb")
const path = require("path")
const multter = require("multer")

//use the dependencies
//connect express engine to public
server.use(express.static(path.join(__dirname,"public"))) //give server access to public folder in project root directory
server.use(bodyParser.urlencoded({extended:false})) //give server access to use and parse messages with clients

//set the server to display the project's front end using ejs as view emgine
server.set("view engine", "ejs")

//connect to mongo db
const _conn = new mongodb.MongoClient(process.env.DB_URL)
const dbname = process.env.DB_NAME
const tbname = process.env.TABLE

//create home page route for the application
// server.use("/", require("./server/routes/home"))
// server.use("/", require("./server/routes/login"))




server.get("/", (req, res) =>{ //set up home route for the application
    res.render("home")
})

server.get("/register", (req, res)=>{
    res.render("register")
})
server.post("/register", async(req, res) =>{ 
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
        res.status(401).send({message:"user registration failed"})
    };

})

server.post("/login", async function(req, res){ //set up home route for the application
    const email = req.body.email.trim()
    const pwd = req.body.pwd.trim()
    //validate agianst empty field 
    if(email.length >= 0 || pwd.length >= 0){
        //confirm password for validity
        let user__pwd = await _conn.db(dbname).collection(tbname).findOne({email:email})
        // const user__credentials = req.cookies.jwt
        if(user__pwd){
            // res.send({message:"Display Admin Dashboard"})
            res.render("admin")
        }else{
            res.send({message:"password mismatched"})
        }      
    }else{
        res.status(401).send({message:"user signon failed"})
    };

})





//jquey teaching rout
server.get("/jq/teachings", function (req, res){
    res.render("jqdemo")
})

//tell the server application to listen at the designated port number
server.listen(PORT, (error) =>{
    if(error){
        console.log("Unable to connect");
    }else{
        console.log(`Server is listening on port ${PORT}`);
    }
})
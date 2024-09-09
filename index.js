
const dotenv = require("dotenv").config();

//use express engine for the project
const express = require("express")

//create a server application using the express engine
const server = express()

//require dependencies
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cors = require("cors")
const mongodb = require("mongodb")
const path = require("path")
const multer = require("multer")
var session = require("express-session")

//use the dependencies
//connect express engine to public
server.use(express.static(path.join(__dirname,"public"))) //give server access to public folder in project root directory
server.use(bodyParser.urlencoded({extended:false})) //give server access to use and parse messages with clients
server.use(cookieParser())
server.use(express.json())
//cORS middleware
server.use(cors())
const corsOptions = { //configure for jwt exchange between client and server
    origin: "/admin/delete",
    credentials: true
};
server.use(cors(corsOptions));

//CLOUDINARY setup
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
}); 
// Log the configuration
console.log(cloudinary.config());
//....................................


// ................ EXPRESS SESSION SETUP --------------------------------//

// server.use(session({
//     name:SESS_NAME,
//     resave: false,
//     saveUninitialized:false,
//     secret:SESS_SECRET,
//     cookie: {
//         maxAge: SESS_LIFETIME,
//         sameSite: true,
//         // secure: IN_PROD
//     }
// }))

// ----------------------------------------------------------------------//

//set the server to display the project's front end using ejs as view emgine
server.set("view engine", "ejs")

//connect to mongo db
const _conn = new mongodb.MongoClient(process.env.DB_URL)
const dbname = process.env.DB_NAME
const tbname = process.env.TABLE
const PORT = process.env.PORT
const ADMIN_USERS = process.env.ADMIN_USERS
const CAT_TABLE = process.env.CAT_TABLE
const SESS_LIFETIME = process.env.SESS_LIFETIME
const SESS_SECRET = process.env.SESS_SECRET

//create home page route for the application
// server.use("/", require("./server/routes/home"))
// server.use("/", require("./server/routes/login"))



//set up home route for the application
server.get("/", (req, res) =>{ 

    res.render("home")

})

//USER Registration route
server.get("/register", (req, res)=>{
    res.render("register", {
         message:""
    })
})


server.post("/register", async(req, res) =>{ 
    const firstname = req.body.firstname.trim()
    const lastname = req.body.lastname.trim()
    const email = req.body.email.trim()
    const pwd = req.body.pwd.trim()
    const cpwd = req.body.cpwd.trim()

    //validate agianst empty field 
    if(firstname.length > 0 && lastname.length > 0 && email.length > 0 && pwd.length > 0 && cpwd.length > 0){
        //confirm password for validity
        if(pwd===cpwd){
            
            try {

                const hashpassword = await bcrypt.hash(pwd,10)

                const profile = {
                    firstname:firstname,
                    lastname:lastname,
                    email:email,
                    pwd:hashpassword
                }

                // Check if the user is already taken
                const existingUser = await _conn.db(process.env.DB_NAME).collection(process.env.TABLE).findOne({ email:email });
                if (existingUser) {
                    // return res.status(400).json({ message: 'User already exists' });
                    return res.render("register", {
                        message: 'User already exists'
                    })
                }else{
            
                    // Create a new user
                    const feedback = await _conn.db(process.env.DB_NAME).collection(process.env.TABLE).insertOne(profile);
                
                    // res.status(201).json({ message: 'User registered successfully' });
                    return res.render("login", {
                        message: 'User registered successfully'
                    })
                }
            

            } catch (error) {
                res.status(500).json({ message: 'Error registering user' });
            }

        }else{
            // res.send({message:"password mismatched"})
            return res.render("register", {
                message:"user password mismatched"
            })
        }
        
    }else{
        // res.status(401).send({message:"user registration failed"})
        return res.render("register", {
           message:"User registration failed. \n Please confirm inputs and try again."
        })      
    };
})

//ADMIN Registration route
server.get("/register-admin", (req, res)=>{
    res.render("register-admin", {
        message:""
    })
    
})

server.post("/register-admin", async(req, res) =>{ 
    const firstname = req.body.firstname.trim()
    const lastname = req.body.lastname.trim()
    const email = req.body.email.trim()
    const pwd = req.body.pwd.trim()
    const cpwd = req.body.cpwd.trim()
    
    //validate agianst empty field 
    if(firstname.length > 0 && lastname.length > 0 && email.length > 0 && pwd.length > 0 && cpwd.length > 0){
        //confirm password for validity
        if(pwd===cpwd){
            //encript user password 
            try {

                const hashpassword = await bcrypt.hash(pwd,10)

                const profile = {
                    firstname:firstname,
                    lastname:lastname,
                    email:email,
                    pwd:hashpassword
                }

                // Check if the admin is already taken
                const existingUser = await _conn.db(process.env.DB_NAME).collection(process.env.ADMIN_USERS).findOne({ email:email });
                if (existingUser) {
                    // return res.status(400).json({ message: 'User already exists' });
                    return res.render("register-admin", {
                        message: 'Admin already exists'
                    })
                }else{
            
                    // Create a new Admin
                    const feedback = await _conn.db(process.env.DB_NAME).collection(process.env.ADMIN_USERS).insertOne(profile);
                
                    // res.status(201).json({ message: 'User registered successfully' });
                    return res.render("register-admin", {
                        message: 'Admin registered successfully'
                    })
                }
            

            } catch (error) {
                res.status(500).json({ message: 'Error registering user' });
            }

        }else{
            // res.send({message:"password mismatched"})
            return res.render("register-admin", {
                message:"password mismatched"
            })
        }
        
    }else{
        // res.status(401).send({message:"Admin registration failed"})
        return res.render("register-admin", {
            message:"Admin registration failed. Please confirm inputs and try again!"
        })
    };

})

//................. Middleware for JWT Token Validation
// const validateToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(' ')[1]; // Bearer <token>
    
//     jwt.verify(token, 'yourSecretKey', (err, payload) => {
//       if (err) {
//         return res.status(403).json({
//           success: false,
//           message: 'Invalid token',
//         });
//       } else {
//         req.user = payload;
//         next();
//       }
//     });
//   } else {
//     res.status(401).json({
//       success: false,
//       message: 'Token is not provided',
//     });
//   }
// };
//....................................................//

//USER login route
server.get("/login", (req, res)=>{
    res.render("login", {
        message:""
    })
})

// USER login route
server.post('/login', async (req, res) => {
    
    const email = req.body.email.trim()
    const pwd = req.body.pwd.trim()
  
    try {
        // Find the user by username
        const user = await _conn.db(process.env.DB_NAME).collection(process.env.TABLE).findOne({ email:email });
        
        if (!user) {
            // return res.status(404).json({ message: 'User not found' });
            return res.render("login", {
                message: 'User not found'
            });
        }
    
        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(pwd, user.pwd);

        if (!passwordMatch) {
            // return res.status(401).json({ message: 'Invalid credentials' });
            return res.render("login", {
                message: 'Invalid user credentials'
            });
        }
    
        // Generate a JWT token
        const login_details = {
            email:email,
            pwd:pwd
            }
        //   const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
        const token = jwt.sign(login_details, SESS_SECRET, SESS_LIFETIME)
        // send token to client
        res.status(200).json({ token });
        // return res.render("home",{
            
        // });

    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
  });

//ADMIN login route
server.get("/login-admin", (req, res)=>{
    res.render("login-admin", {
        message:""
    })
})
server.post("/login-admin", async function(req, res){ 
    const email = req.body.email.trim()
    const pwd = req.body.pwd.trim()
    //validate agianst empty field 
    if(email.length > 0 || pwd.length > 0){
            
        try {
            // Find the admin by email
            const user = await _conn.db(process.env.DB_NAME).collection(process.env.ADMIN_USERS).findOne({ email:email });
            if (!user) {
                // return res.status(404).json({ message: 'User not found' });
                return res.render("login-admin", {
                    message: 'User not found'
                });
            }
        
            // Check if the password is correct
            const passwordMatch = await bcrypt.compare(pwd, user.pwd);

            if (!passwordMatch) {
                // return res.status(401).json({ message: 'Invalid credentials' });
                return res.render("login-admin", {
                    message: 'Invalid user credentials'
                });
            }
        
            // Generate a JWT token
            const login_details = {
                email:email,
                pwd:pwd
                }
            //   const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
            const token = jwt.sign(login_details, "akobet123456789")
            
            // res.status(200).json({ token });
            res.render("admin")

        } catch (error) {
            res.status(500).json({ message: 'Error logging in', reason: error.message });
        }
              
    }else{
        // res.status(401).send({message:"user signon failed"})
        return res.render("login-admin", {
            message:"user signon faile"
        })
    };
})

//ADMIN logout route
server.get("/logout-admin", (req, res)=>{
    res.render("login-admin", {
        message:"Logout successful"
    })
})
server.post("/logout-admin", (req, res)=>{
    req.session.destroy(err => {
        if (err) {
            return res.render("/")
        }

        res.clearCookie(jwt)
        res.render("login-admin")
        res.send("Logout successful")
    })
})

// products image upload's middleware
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, "public/products")
    },
    filename:function(req, file, cb){
        cb(null, file.originalname)
    }
})
var uploads = multer({storage:storage})

// create a route that does the upload process
server.post("/product-upload-single", uploads.single('uploaded-product'), async function(req, res, next){
    console.log(req.file.size);
    var response = "product image uploaded"
    const img_name = req.file.filename.trim()
    const pdtname = req.body.prodtitle.trim()
    const pdtcat = req.body.prodcat.trim()
    const pdtdesc = req.body.proddesc.trim()
    const pdtprice = req.body.prodprice.trim()
    const prodqty = req.body.prodqty.trim()
    /////////////////////////
    // CLOUDINARY Uploads an image file
    const imagePath = req.file.path
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        };
    const result = await cloudinary.uploader.upload(imagePath, options);
    //.....
    const products = {
        img_name:img_name,
        cloudinary_id: result.public_id,
        cloudinary_image: result.secure_url,
        pdtname:pdtname,
        pdtcat:pdtcat,
        pdtdesc:pdtdesc,
        pdtprice:pdtprice,
        prodqty:prodqty
    }
    console.log("products ", products);
    const feed = await _conn.db(dbname).collection("products").insertOne(products) 
    if(feed){
        res.status(200).render("admin", {
            message:"product uploaded successfully",
            type:"success"
        })
    }else{
        res.send({
            message:"unable to upload image"
        })
    }
})

// REPLACE Product Image route for products
server.post("/product-image-replace", uploads.single('newImage__upload'), async function(req, res){
    const img_name = req.file.filename
    const pdtname = req.body.pdtname

    // CLOUDINARY Uploads an image file
    const imagePath = req.file.path
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        };
    const result = await cloudinary.uploader.upload(imagePath, options);
    //.....
    console.log(pdtname, img_name);

    try {

        const product_toEdit = await _conn.db(dbname).collection("products").findOneAndUpdate({pdtname: pdtname}, {$set:{img_name: img_name,cloudinary_id: result.public_id,
            cloudinary_image: result.secure_url}})

        res.status(200).render('admin',{
            message:"Product to edit fetched",
            type:"success",
            product_toEdit:product_toEdit
        })

    } catch (error) {
        console.log(error);
    }

})

// ADMIN view all products route
server.get("/product-view-all", async function(req, res){
    // identify the calling category
    const selectedCat = req.query //Not working yet

    console.log('server selectedCat',selectedCat); //Not working yet

    const products__data = await _conn.db(dbname).collection("products").find(selectedCat).toArray()


    if(products__data){
        res.status(200).send({
            message:"all products fetched",
            type:"success",
            products__data:products__data
        })
    }else{
        res.status(401).send({
            message:"no products available"
        })
    }
})

// ADMIN view by categories route
server.get("/admin-viewby-category", async function(req, res){
    
    const selectedCat = req.query.pdtcat.trim()

    console.log('/admin-viewby-category ', selectedCat);

    const feedback = await _conn.db(dbname).collection("products").find({pdtcat:selectedCat}).toArray();

    console.log('/admin-viewby-category ', feedback);

    if(feedback){
        res.status(200).send({
            message:"all products in category fetched",
            type:"success",
            feedback:feedback
        })
    }else{
        res.status(401).send({
            message:"no products available"
        })
    }
})


// USER view all products route
server.get("/shopfloor-all", async function(req, res){
    const products__data = await _conn.db(dbname).collection("products").find().toArray()
    if(products__data){
        res.status(200).send({
            message:"all products fetched",
            type:"success",
            products__data:products__data
        })
    }else{
        res.status(401).send({
            message:"no products available"
        })
    }
})

//ADMIN Delete product from database-------------------

server.get("/product-delete", async function(req,res){
    
    const target_id = req.cookies.delItem_id
    console.log("target id ",target_id);

    //.........Add set-cookie header to the API response..............//
    // let options = {
    //     maxAge: 1000 * 60 * 60 * 2,
    //     httpOnly: true,
    //     sameSite: "none",
    //     secure: true
    // }
    // const delId_token = jwt.sign({ delId: target_id }, 'secretKey', { expiresIn: 1000 * 60 * 60 * 2 });

    // const delId_token = target_id;

    // res.cookie("delId_token", delId_token, options);
    // res.send("Cookie has been set! " + delId_token);
    //...............................................................//

    try{
        
        const toDelete__data = await _conn.db(dbname).collection("products").findOneAndDelete({pdtname:target_id})
        
        // Delete image from cloudinary
        await cloudinary.uploader.destroy(toDelete__data.cloudinary_id);

        console.log(toDelete__data)

        res.status(200).render("admin",{
            message:"delete operation successful...",
        });
        // res.status(500).render("delete-products",{
        //     message: error.message
        // });
    }catch(e){
        console.log(e);
    }
})

//ADMIN Edit product detials -------------------
server.get("/admin-editproduct", async function(req, res){
    // res.render('admin-editproduct')
    const target_id = req.cookies.editedProductId
    const target_product = req.cookies.editedProduct
    const filter = {_id: target_id}
    const filter2 = {pdtname: target_product}
    try {
        const product_toEdit = await _conn.db(dbname).collection("products").findOne(filter2)
        res.status(200).send(product_toEdit)
    } catch (error) {
        console.log(error);
    }
})

server.post("/admin-update-product", async function(req, res){
    // res.status(200).send({
    //     message:"update successful..."
    // })
    console.log(req.body)
})

server.post("/admin-editproduct-update", async function(req, res){
    
    const pdtname = req.body.prodtitle.trim()
    const pdtcat = req.body.prodcat.trim()
    const pdtdesc = req.body.proddesc.trim()
    const pdtprice = req.body.prodprice.trim()
    const prodqty = req.body.prodqty.trim()

    // console.log(pdtname,pdtcat,pdtdesc,pdtprice,prodqty);

    try {

        const product_toEdit = await _conn.db(dbname).collection("products").findOneAndUpdate({pdtname: pdtname}, {$set:{pdtname: pdtname, pdtcat: pdtcat, pdtdesc: pdtdesc, pdtprice: pdtprice, prodqty: prodqty}})

        res.status(200).render('admin',{
            message:"Product to edit fetched",
            type:"success",
            product_toEdit:product_toEdit
        })

    } catch (error) {
        console.log(error);
    }
})

//ADMIN retrieve categories -------------------
server.get("/admin-manage-categories", async function(req, res){
    // res.render('admin-editproduct')
    try {
        const category_array = await _conn.db(dbname).collection("product_catgories").find().toArray()
        res.status(200).send(category_array)
    } catch (error) {
        console.log(error);
    }
})
//ADMIN Create categories -------------------
server.post("/admin-manage-categories", async function(req, res){
    const catName = req.body.cat_name.trim()
    const catDesc = req.body.cat_desc.trim()
    const new_category = {
        catName:catName,
        catDesc:catDesc
    } 
    try {
        const category_record = await _conn.db(dbname).collection("product_catgories").insertOne(new_category)
        res.status(200).render("admin");
    } catch (error) {
        console.log(error);
    }
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
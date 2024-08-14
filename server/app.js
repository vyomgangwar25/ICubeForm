const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

app.get('/', (req, resp) => {
    resp.send("hello");
});

mongoose.connect('mongodb://127.0.0.1:27017/IcubeForm')
    .then(() => {
        console.log("mongodb connected");
    })
    .catch((err) => {
        console.error("error in connecting", err);
    });

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});

const userdb = mongoose.model("users", userSchema);

app.post("/register", async (req, resp) => {
   // console.log(body)
    const { fname, email, password } = req.body;
    try {
        const preuser = await userdb.findOne({ email: email });
        if (preuser) {
            return resp.status(422).json({ error: "User already exists" });
        }
        const finalUser = new userdb({
            fname: fname,
            email: email,
            password: password
        });
        const storeData = await finalUser.save();
        return resp.status(201).json({ status: 201, storeData });
    } catch (error) {
        console.error("error occurred during registration", error);
        return resp.status(500).json({ error: "error occurred during registration" });
    }
});


//login

app.post("/Login",async(req,resp)=>{
     
    const{email,pass}=req.body;
    //console.log(pass)

    const userValid=await userdb.findOne({email:email});
   
    if(!userValid)
        return resp.status(401).json({ error: 'Invalid email or password' });
    if (pass !== userValid.password) {
        return resp.status(401).json({ error: 'Invalid email or password' });
    }
    resp.status(201).json({ status: 200, message: 'Login successful' });


})

app.listen(8000, () => {
    console.log("server started at 8000");
});

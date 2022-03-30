const userModel = require("../models/userModel");
 const jwt = require('jsonwebtoken');
 const moment=require("moment")


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidTitle = function (title) {
    return ['Mr', 'Mrs', "Miss"].indexOf(title) !== -1
}


const createUser = async function (req, res) {
    try {
        let data = req.body

        let { title, name, phone, email, password, address } = data // Destructuring

        if (Object.keys(data).length == 0) {
            res.status(400).send({ status: false, msg: "BAD REQUEST" })
            return
        }
        if (!isValid(name)) {
            res.status(400).send({ status: false, msg: "Name is mandatory" })
            return
        }
        if (!isValid(title)) {
            res.status(400).send({ status: false, msg: "Title is mandatory" })
            return
        }
        if (!isValidTitle(title)) {
            res.status(400).send({ status: false, msg: "Title should be only with Mr, Mrs and Miss" })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "Email is mandatory" })
            return
        }
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, msg: "Invalid Email" })
            return
        }
       
        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "Password is mandatory" })
            return
        }
        if (password.trim().length > 15) {
            res.status(400).send({ status: false, msg: "Password should be less than 15 characters"})
            return
        }
        if (password.trim().length < 8) {
            res.status(400).send({ status: false, msg: "Password should be more than 8 characters"})
            return
        }
        if (!isValid(phone)) {
            res.status(400).send({ status: false, msg: "Phone Number is mandatory" })
            return
        }
        if (!(/^\d{10}$/.test(phone))) {
            res.status(400).send({ status: false, msg: "Invalid Phone Number, it should be of 10 digits" })
            return
        }
        if (!isValid(address)){
            res.status(400).send({status:false,msg:"address is required"})
            return
        }
       
        let isEmailAlreadyUsed = await userModel.findOne({ email })
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, msg: "Email Already Exists" })
            return
        }
        let isPhoneAlreadyUsed = await userModel.findOne({ phone })
        if (isPhoneAlreadyUsed) {
            res.status(400).send({ status: false, msg: "Phone number Already Exists" })
            return
        }
        else {
            let createdUser = await userModel.create(data)
            res.status(201).send({ data: createdUser })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }

}


const loginUser=async function(req,res){
    try {
        let body=req.body
        let {email,password}=body
        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "Email is required" })
            return
        }
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, msg: "email should have valid email address" })
            return
        }
        
        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "Password is required" })
            return
        }
        let userDetails=await userModel.findOne({email:email,password:password})
        if(!userDetails){
            return res.status(400).send({status:false,msg:"please provide email and password"})
        }
        else{
            let token=jwt.sign({userId:userDetails._id,
                // iat:Math.floor(Date.now()/1000),
                // exp:Math.floor(Date.now()/1000)+10*60*60

            },"project3-group37-booksmanagement",{expiresIn:"60m"})
            res.header("x-api-key",token)
            res.status(201).send({status:true,msg:"user login sucessfull",data:token})

        }
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:error.message})
        
    }
}

module.exports.createUser=createUser
module.exports.loginUser=loginUser
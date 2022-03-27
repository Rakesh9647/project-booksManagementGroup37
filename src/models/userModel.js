const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Title is required",
        enum: ["Mr", "Mrs", "Miss"]
    },
    name: {
        type: String,
        required: "User name is required",
        trim: true
    },
    phone: {
        type: String,
        required: "Phone number is required",
        trim: true,
        unique: true,
        validate: {
            validator: function (phone) {
                if (/^\d{10}$/.test(phone)) {
                    return (true)
                } else {
                    alert("Invalid number, must be of ten digits")
                    number.focus()
                    return (false)
                }
            }
        }
    },
    email: {
    type: String,
    required: "Email is required",
    unique: true,
    validate: {
        validator: function (email) {
            if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
                return (true)
            }
            alert("You have entered an invalid email address!")
            return (false)
        }
    }
},
    password: {
    type: String,
    required: "Password is required",
    trim: true
},
    address: {
    street: String,
    city: String,
    pincode: String
}
}, { timestamps: true })


module.exports = mongoose.model("User", userSchema);
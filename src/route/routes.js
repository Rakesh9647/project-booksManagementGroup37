const express=require('express');
const router=express.Router();
const userController = require("../controller/userController")
const bookController=require("../controller/bookController")
const reviewController = require('../controller/reviewController');


router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.post("/books",bookController.createBook)
router.get("/books",bookController.getAllbooks)
 router.get("/books/:bookId",bookController.getbooksById)
router.put("/books/:bookId",bookController.updateBookDetails)
router.delete("/books/:bookId",bookController.deleteBooksBYId)



 router.post("/books/:bookId/review",reviewController.createReview)



module.exports=router
const express=require('express');
const router=express.Router();
const userController = require("../controller/userController")
const bookController=require("../controller/bookController")
const reviewController = require('../controller/reviewController');
const middleWare=require("../middleWare/middleWare")


router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.post("/books",middleWare.authenticate,bookController.createBook)
router.get("/books",middleWare.authenticate,bookController.getAllbooks)
 router.get("/books/:bookId",middleWare.authenticate,bookController.getbooksById)
router.put("/books/:bookId",middleWare.authenticate,bookController.updateBookDetails)
router.delete("/books/:bookId",middleWare.authenticate,bookController.deleteBooksBYId)



 router.post("/books/:bookId/review",reviewController.createReview)

router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)

router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)



module.exports=router
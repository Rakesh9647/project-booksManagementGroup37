const bookModel=require("../models/bookModel")
const userModel = require("../models/userModel");
const reviewModel = require('../Models/reviewModel');
const moment=require('moment')
const mongoose=require("mongoose")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId)
}



const isValidRequestBody = function (data) {
    return Object.keys(data).length > 0
  }
  
 
  
  const createBook = async function (req, res) {
    try {
  
      let data = req.body
      let {title,excerpt,userId,ISBN,category,subcategory,releasedAt}=data

      if (!isValidRequestBody(data)) {
        res.status(400).send({ status: false, msg: 'please provide valid  details' })
        return
      }
  
      if (!isValid(title)) {
        res.status(400).send({ status: false, msg: 'title is required' })
        return
      }
  
      if (!isValid(excerpt)) {
        res.status(400).send({ status: false, msg: ' excerpt is required' })
        return
      }
      if (!isValid(userId)) {   
        res.status(400).send({ status: false, msg: ' user id is required' })
        return
      }
      
      if (!isValidObjectId(userId)) {
        res.status(400).send({ status: false, msg: "userId is not valid" })
        return

      }
  
  
      if (!isValid(ISBN)) {
        res.status(400).send({ status: false, msg: ' ISBN is required' })
        return
      }
  
      if (!isValid(category)) {
        res.status(400).send({ status: false, msg: ' category is required' })
        return
      }
  
      if (!isValid(subcategory)) {
        res.status(400).send({ status: false, msg: ' subcategory is required' })
        return
      }
      
      if (!isValid(releasedAt)) {
        res.status(400).send({ status: false, msg: ' releasedAt is required' })
        return
      }
      if(!moment(releasedAt, "YYYY-MM-DD").isValid()){
        return res.status(400).send({status:false,msg:"please provide correct dtae month and year in yy-mm-dd"})
      }

   
    
     
  
      let userID = await userModel.findById(userId)
      console.log(userID)
      if (!userID) {
        return res.status(400).send({ status: false, msg: "please provide right userId" })
      }

    if(req.userId!=data.userId){
      return res.status(400).send({status:false,msg:"you are not authorized"})
    }
  
      let  Title= await bookModel.findOne({ title })
      if (Title) {
        return res.status(400).send({ status: false, msg: "title already exist" })
      }
  
      let uniqueISBN = await bookModel.findOne({ ISBN}) 
      if (uniqueISBN) {       
        return res.status(400).send({ status: false, msg: "ISBN already exist" })
      }
  
      
  
      
  
      let createdBook = await bookModel.create(data);
  
      res.status(201).send({ status: true, data: createdBook });
  
    } catch (error) {
  
      res.status(500).send({ status: false, msg: error.message });
  
    }
  };
   

  const getAllbooks=async function(req,res){
      try {
      
          data=req.query

        let book ={ isDeleted:false }

        if (isValid(data.userId)) {
          book.userId =data.userId
        }    
    
        if (isValid(data.category)) {
          book.category =data.category
        }
    
        if (isValid(data.subcategory)) {
          book.subcategory =data.subcategory
        }
        if(data.userId){
    
          if(!isValidObjectId(data.userId)) {      
            res.status(400).send({status: false, message:"userId is not valid"})
            return
           }
      
         }
        
       
        let getbooks=await bookModel.find(book).select({_id:1,excerpt:1,title:1,category:1,subcategory:1,ISBN:1,releasedAt:1,userId:1}).sort({title:1})

          return res.status(200).send({status:true,data:getbooks})

        
      } catch (error) {
        return res.status(500).send({status:false,msg:error.message})

        
      }
  }



  const getbooksById = async function (req, res) {
    try {

        let bookId = req.params.bookId

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: "please provide bookId" })
        }
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "please provide valid bookId" })
        }

        const bookIdData = await bookModel.findById({ _id: bookId }).select({ __v: 0 }).lean()

        if (!bookIdData) {
            return res.status(404).send({ status: false, message: "no documents  found" })
        }



        const reviewData = await reviewModel.find({ $and: [{ bookId: bookId }, { isDeleted: false }] }).select({ isDeleted: 0, __v: 0, createdAt: 0, updatedAt: 0 })
        if (reviewData.length != 0) {
            bookIdData["reviewsData"] = reviewData
        } else {
            bookIdData["reviewsData"] = []
        }


        return res.status(200).send({ status: false, message: "book list", data: bookIdData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }


}


const updateBookDetails = async function (req, res) {
  try {
      const requestBody = req.body
      const { title, excerpt, releasedAt, ISBN } = requestBody
      const bookId = req.params.bookId

      

      let finalFilter = {}


      if (!isValid(bookId)) {
          return res.status(400).send({ status: false, message: "please provide bookId" })
      }
      if (!isValidObjectId(bookId)) {
          return res.status(400).send({ status: false, message: "please provide valid bookId" })
      }

      if (!isValidRequestBody(requestBody)) {
          return res.status(400).send({ status: false, message: "please provide input via body" })
      }
        
      const BookId=await bookModel.findById(bookId)
      if(!BookId){
        return res.status(400).send({status:false,msg:"this bookid is not exist"})
      }
      if(req.userId!=BookId.userId){
        return res.status(403).send({status:false,msg:"you are not authorized"})
      }
   
       


      if (isValid(title)) {

          const isTitleAlreadyExist = await bookModel.findOne({ $and: [{ title: title }, { isDeleted: false }] })

          if (isTitleAlreadyExist) {
              return res.status(400).send({ status: false, message: "title already exists" })
          }



          finalFilter["title"] = title
      }

      if (isValid(excerpt)) {
          finalFilter["excerpt"] = excerpt
      }
      if (isValid(releasedAt)) {
        if(!moment(releasedAt, "YYYY-MM-DD").isValid()){
          return res.status(400).send({status:false,msg:"please provide correct date month and year in yy-mm-dd"})
        }
          finalFilter["releasedAt"] = releasedAt

      }
      if (isValid(ISBN)) {

          const isISBNAlreadyExist = await bookModel.findOne({ $and: [{ ISBN: ISBN }, { isDeleted: false }] })

          if (isISBNAlreadyExist) {
              return res.status(400).send({ status: false, message: "ISBN already exists" })
          }

          finalFilter["ISBN"] = ISBN
      }



      const updatedData = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: finalFilter }, { new: true })




      return res.status(200).send({ status: true, message: "success", data: updatedData })


  } catch (err) {
      return res.status(500).send({ status: false, message: err.message })
  }

}
   





      const deleteBooksBYId = async function (req, res) {
        try {
          let bookId = req.params.bookId
      
          let Deletbook = await bookModel.findOne({ _id: bookId, isDeleted: false })
      
          if(!Deletbook){    
            return res.status(404).send({status:false,message:'book not found or already deleted'})
          }

          if(req.userId!=Deletbook.userId){
            return res.status(400).send({status:false,message:"you are not authorized"})
          }
      
          
      
          let bookDeleted = await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: new Date() }, { new: true })
      
          res.status(200).send({ status: true, message: 'sucessfully deleted', data: bookDeleted})
      
        } catch (error) {
          res.status(500).send({ status: false, error: error.message });
        }
      }

























  module.exports.createBook=createBook
  module.exports.getAllbooks=getAllbooks
  module.exports.getbooksById=getbooksById
  module.exports.updateBookDetails=updateBookDetails
  module.exports.deleteBooksBYId=deleteBooksBYId
 
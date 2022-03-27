const bookModel=require("../models/bookModel")
const userModel = require("../models/userModel");

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}


const isValidRequestBody = function (data) {
    return Object.keys(data).length > 0
  }
  
 
  
  const createBook = async function (req, res) {
    try {
  
      let data = req.body

      if (!isValidRequestBody(data)) {
        res.status(400).send({ status: false, msg: 'please provide valid  details' })
        return
      }
  
      if (!isValid(data.title)) {
        res.status(400).send({ status: false, msg: 'title is required' })
        return
      }
  
      if (!isValid(data.excerpt)) {
        res.status(400).send({ status: false, msg: ' excerpt is required' })
        return
      }
      if (!isValid(data.userId)) {   
        res.status(400).send({ status: false, msg: ' user id is required' })
        return
      }
  
  
      if (!isValid(data.ISBN)) {
        res.status(400).send({ status: false, msg: ' ISBN is required' })
        return
      }
  
      if (!isValid(data.category)) {
        res.status(400).send({ status: false, msg: ' category is required' })
        return
      }
  
      if (!isValid(data.subcategory)) {
        res.status(400).send({ status: false, msg: ' subcategory is required' })
        return
      }
  
      if (!isValid(data.releasedAt)) {
        res.status(400).send({ status: false, msg: ' releasedAt is required' })
        return
      }
  
    
     
  
      let userID = await bookModel.findOne({ userId: data.userId })
      if (!userID) {
        return res.status(400).send({ status: false, msg: "please provide right userId" })
      }
  
      
  
      let  Title= await bookModel.findOne({ title: data.title })
      if (Title) {
        return res.status(400).send({ status: false, msg: "title already exist" })
      }
  
      let uniqueISBN = await bookModel.findOne({ ISBN: data.ISBN }) 
      if (uniqueISBN) {       
        return res.status(400).send({ status: false, msg: "ISBN already exist" })
      }
  
      
  
      
  
      let createdBook = await bookModel.create(data);
  
      res.status(201).send({ status: true, data: createdBook });
  
    } catch (error) {
  
      res.status(500).send({ status: false, msg: error.message });
  
    }
  };


  module.exports.createBook=createBook
const reviewModel = require('../Models/reviewModel');

const bookModel=require("../models/bookModel")
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

const createReview = async function (req, res) {
    try {

        let requestBody = req.body
        const { rating, reviewedBy } = requestBody
        let bookId = req.params.bookId

        if (!isValid(bookId)) {
            return res.status(400).send({
                status: false,
                message: "please provide bookId in params"
            })
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({
                status: false,
                message: "please provide valid bookId"
            })
        }

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({
                status: false,
                message: "please provide input via body"
            })
        }

        if (!isValid(rating)) {
            return res.status(400).send({
                status: false,
                message: "please provide rating"
            })
        }

       if(reviewedBy.trim().length === 0){
        requestBody["reviewedBy"] = "Guest"
       }



      

        let isBookIdExist = await bookModel.findById({ _id: bookId })

        if (!isBookIdExist) {
            return res.status(400).send({
                status: false,
                message: "please provide correct bookId"
            })
        } else {
            requestBody["bookId"] = bookId
        }

        if (isBookIdExist.isDeleted === false) {
            requestBody["reviewedAt"] = new Date();
        } else {
            return res.status(400).send({
                status: false,
                message: "book is already deleted"
            })
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).send({
                status: false,
                message: "please provide rating in between 1 to 5"
            })
        }


        let reviewData = await reviewModel.create(requestBody)
        if (reviewData) {

            let updated = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } })
            console.log(updated)
        }


        res.status(201).send({
            status: true, data: {
                "_id": reviewData._id,
                "bookId": reviewData.bookId,
                "reviewedBy": reviewData.reviewedBy,
                "reviewedAt": reviewData.reviewedAt,
                "rating": reviewData.rating,
                "review": reviewData.review
            }
        })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}












module.exports.createReview=createReview
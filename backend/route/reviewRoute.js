import express from 'express'
import isAuth from '../middleware/isAuth.js'
import { addReview, adminReply, deleteReview, getAllReviews } from '../controller/reviewController.js'

const reviewRoute = express.Router()

reviewRoute.post("/add-review",isAuth,addReview)
reviewRoute.post("/all-review",isAuth,getAllReviews)
reviewRoute.post("/reply-review",isAuth,adminReply)
reviewRoute.post("/delete-review",isAuth,deleteReview)

export default reviewRoute;
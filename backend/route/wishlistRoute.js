import express from 'express'
import { addToWishlist, removeFromWishlist, usersWishlist } from '../controller/wishlistController.js'
import {isAuth} from '../middleware/isAuth.js'
const wishlistRoute = express.Router()

wishlistRoute.post("/add-wishlist",isAuth,addToWishlist)
wishlistRoute.post("/remove-wishlist",isAuth,removeFromWishlist)
wishlistRoute.post("/wishlist",isAuth,usersWishlist)


export default wishlistRoute
import express from 'express'
import { getAllNotification, notificationCount } from '../controller/NotificationController.js'
import {isAuth} from '../middleware/isAuth.js'

const notificationRoute = express.Router()
notificationRoute.post("/all-notification",isAuth ,getAllNotification)
notificationRoute.post("/count" ,isAuth,notificationCount)

export default notificationRoute;
import express from 'express';
import { createServer } from 'http';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';
import { registerUser , loginUser , getProfile , updateProfile , bookAppointment, listAppointment, cancelAppointment } from '../controllers/userController.js';
import { autoRep } from '../controllers/chatbot.js';



const userRouter = express.Router()

userRouter.post('/register', registerUser )
userRouter.post('/login', loginUser )
userRouter.get('/get-profile', authUser , getProfile )
userRouter.post('/update-profile', upload.single('image') , authUser , updateProfile )
userRouter.post('/chat-bot', authUser , autoRep )
userRouter.post('/book-appointment' , authUser , bookAppointment)
userRouter.get('/appointments', authUser , listAppointment)
userRouter.post('/cancel-appointment', authUser , cancelAppointment)



export default userRouter ;


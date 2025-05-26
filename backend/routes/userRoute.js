import express from 'express';
import { createServer } from 'http';
import passport from 'passport';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';
import { registerUser , loginUser , getProfile , updateProfile , bookAppointment,
         updateApptStar , listAppointment, cancelAppointment, googleLoginHandler , getApptByYearMonth } from '../controllers/userController.js';
import { autoRep } from '../controllers/chatbot.js';
import { addMedicine , getMedicines , deleteMedicine } from "../controllers/medicineController.js";



const userRouter = express.Router()

userRouter.post('/register', registerUser )
userRouter.post('/login', loginUser )
userRouter.get('/get-profile', authUser , getProfile )
userRouter.post('/update-profile', upload.single('image') , authUser , updateProfile )
userRouter.post('/chat-bot', authUser , autoRep )
userRouter.post('/book-appointment' , authUser , bookAppointment)
userRouter.get('/appointments', authUser , listAppointment)
userRouter.get('/apptFilter', authUser , getApptByYearMonth)
userRouter.post('/cancel-appointment', authUser , cancelAppointment)
userRouter.post('/rate-doctor', authUser , updateApptStar ) 

// Google OAuth routes
userRouter.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

userRouter.get('/get-medicines', authUser , getMedicines)

userRouter.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleLoginHandler
);

export default userRouter ;


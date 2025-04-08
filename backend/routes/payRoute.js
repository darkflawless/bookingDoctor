

import express from 'express';
import authUser from '../middlewares/authUser.js';
import { confirmPayment } from '../controllers/paymentController.js';


const payRouter = express.Router()

payRouter.post('/pay' , authUser , confirmPayment )

export default payRouter ;



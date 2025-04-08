

import express from "express";
import { addDoctor , adminLogin, allDoctors , appointmentsAdmin , adminCancel , adminDashboard } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorControler.js";


const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin ,upload.single('image') , addDoctor)
adminRouter.post('/login',adminLogin )
adminRouter.post('/all-doctors', authAdmin , allDoctors)
adminRouter.post('/change-availability', authAdmin , changeAvailability)
adminRouter.get('/all-appointments', authAdmin , appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin , adminCancel )
adminRouter.get('/dashboard', authAdmin , adminDashboard)


export default adminRouter;


import express from "express";
import { addDoctor , adminLogin, allDoctors , appointmentsAdmin , 
    adminCancel , adminDashboard , deleteDoctor , getTopDoctorsStats , getStatData , getUser , deleteUser } from "../controllers/adminController.js";
// import { addMedicine , getMedicines , deleteMedicine } from "../controllers/medicineController.js";
import upload from "../middlewares/multer.js";
import { addMedicine , getMedicines , deleteMedicine } from "../controllers/medicineController.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability , completeAppointment  } from "../controllers/doctorControler.js";
import { getSchedule , getApptByYearMonth } from "../controllers/calendarController.js";

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin ,upload.single('image') , addDoctor)
adminRouter.post('/login',adminLogin )
adminRouter.post('/all-doctors', authAdmin , allDoctors)
adminRouter.post('/change-availability', authAdmin , changeAvailability)
adminRouter.get('/all-appointments', authAdmin , appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin , adminCancel )
adminRouter.post('/complete-appointment', authAdmin , completeAppointment )
adminRouter.get('/dashboard', authAdmin , adminDashboard)
adminRouter.post('/delete-doctor', authAdmin , deleteDoctor)
adminRouter.post('/update-doctor', authAdmin , upload.single('image') , addDoctor)
adminRouter.post('/add-medicine', authAdmin , upload.single('image') , addMedicine)
adminRouter.get('/get-medicines', authAdmin , getMedicines)
adminRouter.post('/delete-medicine', authAdmin , deleteMedicine)
adminRouter.get('/get-user', authAdmin , getUser)

adminRouter.post('/delete-user', authAdmin , deleteUser )
//calendar
adminRouter.get('/calendar', authAdmin , getSchedule )
adminRouter.get('/apptFilter', authAdmin , getApptByYearMonth )
// for statistics
adminRouter.get('/get-stat-data', authAdmin , getStatData )

adminRouter.get('/get-doctor-stats', authAdmin , getStatData )
adminRouter.get('/get-top-doctors', authAdmin , getTopDoctorsStats )


export default adminRouter;
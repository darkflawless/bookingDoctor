

import express from'express'
import { doctorList , loginDoctor , appointmentDoctor, completeAppointment, 
    cancelAppointment , doctorDashboard , doctorProfile , updateDoctorProfile } from '../controllers/doctorControler.js'

import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList )
doctorRouter.post('/login', loginDoctor )
doctorRouter.get('/appointments', authDoctor, appointmentDoctor )
doctorRouter.post('/complete-appointment', authDoctor, completeAppointment )
doctorRouter.post('/cancel-appointment', authDoctor, cancelAppointment )
doctorRouter.get('/dashboard', authDoctor, doctorDashboard )
doctorRouter.get('/profile', authDoctor, doctorProfile )
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile )

export default doctorRouter;
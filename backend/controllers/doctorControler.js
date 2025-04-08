import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        res.json({ success: true, message: "Availability changed" });


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// api for doctor login

const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        const isMatch = await bcrypt.compare(password, doctor.password)
        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, message: "Logged in successfully", token })
        } else {
            return res.json({ success: false, message: "Invalid password" });
        }



    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

//api

const appointmentDoctor = async (req, res) => {
    try {
        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// api to mark appointment completed 

const completeAppointment = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && docId === appointmentData.docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: "Appointment completed" })
        } else {
            return res.json({ success: false, message: "Mark invalid" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// api to cancel too
const cancelAppointment = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && docId === appointmentData.docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: false, cancelled : true })
            return res.json({ success: true, message: "Appointment cancelled" })
        }
        else {
            return res.json({ success: false, message: "Cancel invalid" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// dashboard  api

const doctorDashboard = async (req, res) => {

 try {
    const { docId } = req.body

    const appointments = await appointmentModel.find({ docId })
    const totalAppointments = appointments.length
    if (totalAppointments === 0) {
        return res.json({ success: false, message: "No appointments found" })
    }
    let earnings = 0
    appointments.map((item) => {
        if (item.isCompleted || item.payment ) {
            earnings += item.amount
        }
    })

    let patients = []
    appointments.map((item) => {
        if (!patients.includes(item.userId._id)) {
            patients.push(item.userId._id)
        }
    })

    const data = {
        appointments,
        totalAppointments,
        patients: patients.length,
        earnings,
        latestAppointments : appointments.reverse().slice(0, 5),
    }
    res.json({ success: true, data })


 } catch (error) {
     console.log(error)
        res.json({ success: false, message: error.message })
 }

}

// doctor profile api
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body
        const doctor = await doctorModel.findById(docId).select(['-password'])
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        res.json({ success: true, doctor })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api to update doctor profile
const updateDoctorProfile = async (req, res) => {

    try {
        const { docId, fees , address , available  } = req.body
        const doctor = await doctorModel.findById(docId).select(['-password'])
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        await doctorModel.findByIdAndUpdate(docId, { fees , address , available  })
        res.json({ success: true, message: "Profile updated successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



export { doctorList, changeAvailability, loginDoctor, appointmentDoctor, 
            completeAppointment, cancelAppointment , doctorDashboard , 
                doctorProfile , updateDoctorProfile }

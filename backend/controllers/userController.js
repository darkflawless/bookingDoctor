
import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
//api to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing detail" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password should be at least 8 characters long" })
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)

        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        // 
        res.json({ success: true, token })



    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid password" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api to get user data

const getProfile = async (req, res) => {

    try {

        const userId = req.userId
        const userData = await userModel.findById(userId).select('-password')
        res.json({ success: true, userData })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

//api to update user profile 

const updateProfile = async (req, res) => {
    const userId = req.userId

    try {

        const { name, phone, address , dob, gender } = req.body

        const imageFile = req.file
        if (!name || !phone  || !address || !dob || !gender) {
            return res.json({ success: false, message: "Please fill all fields" })
        } 

        await userModel.findByIdAndUpdate(userId,  { name, phone, address : JSON.parse(address), dob, gender })

        if (imageFile) {

            //upload image to cloud
             const imageUpload =  await cloudinary.uploader.upload(imageFile.path ,{ resource_type : 'image'}) 
             const imageURL = imageUpload.secure_url
             
             await userModel.findByIdAndUpdate(userId, {image : imageURL})
        }

        res.json({success : true , message : "profile updated" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//APi to book appointment 
const bookAppointment = async (req, res) => {
    try {
        const userId = req.userId
        const { docId, slotDate, slotTime } = req.body;

        function formatToISO(dateStr, timeStr) {
            const [day, month, year] = dateStr.split("_");
            // Đảm bảo "AM/PM" được parse đúng bằng cách thêm vào Date string chuẩn
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${timeStr}`;
        }

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available){
            return res.json({ success: false, message: "Doctor is not available" })
        }

        let slots_booked = docData.slots_booked 

        // check if available

        if (slots_booked[slotDate]){
            if (slots_booked[slotDate].includes(slotTime)){
                return res.json({ success: false, message: "Slot is already booked" })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }


        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId ,
            userData ,
            docData ,
            amount : docData.fees ,
            slotTime ,
            slotDate ,
            date : Date.now() ,
            dateBooked : formatToISO(slotDate, slotTime),
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // update slot booked in doctor model

        await doctorModel.findByIdAndUpdate(docId, { slots_booked } )

        res.json({ success: true, message: "Appointment booked successfully" })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api 

const listAppointment = async (req, res) => {
    try {
      const pageNum = parseInt(req.query.pageNum) || 1; // lấy từ query
      const userId = req.userId;
      const perPage = 5;
  
      if (!userId || pageNum < 1) {
        return res.status(400).json({ success: false, message: 'Invalid userId or pageNum' });
      }
  
      const skip = (pageNum - 1) * perPage;
  
      const appointments = await appointmentModel
        .find({ userId })
        .sort({ dateBooked: -1 })
        .skip(skip)
        .limit(perPage)
        .lean();
  
      const totalAppointments = await appointmentModel.countDocuments({ userId });
  
      res.json({
        success: true,
        appointments,
        totalAppointments,
        totalPages: Math.ceil(totalAppointments / perPage),
        currentPage: pageNum,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

//
const cancelAppointment = async (req, res) =>{
    try {
        const userId = req.userId
        const { appointmentId } = req.body
        const appointmentData  = await appointmentModel.findById(appointmentId)

        // add verify appointment user
        // if (appointmentData.userId !== userId){
        //     return res.json({ success: false, message: "You are not authorized to cancel this appointment"})
        // } 

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled : true})

        // releasing slot booked in doctor model

        const { docId , slotDate , slotTime} = appointmentData
        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId , {slots_booked} )

        res.json({success: true, message: "Appointment cancelled successfully"})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });  
    }
}



export { registerUser, loginUser, getProfile , updateProfile , bookAppointment , listAppointment , cancelAppointment }

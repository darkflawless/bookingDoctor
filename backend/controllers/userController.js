
import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import redisClient from '../cache/redisClient.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/user/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            let user = await userModel.findOne({ email });

            if (!user) {
                user = new userModel({
                    name: profile.displayName,
                    email,
                    password: null, // No password for Google OAuth users
                    googleId: profile.id
                });
                await user.save();
            }

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }
));

// Google OAuth login handler
const googleLoginHandler = (req, res) => {
    // User is attached to req.user by passport after successful authentication
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication failed" });
    }
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
};

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

// Export the new googleLoginHandler


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

        const { name, phone, address, dob, gender } = req.body

        const imageFile = req.file
        if (!name || !phone || !address || !dob || !gender) {
            return res.json({ success: false, message: "Please fill all fields" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            //upload image to cloud
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: "profile updated" })

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

        console.log({ docId, slotDate, slotTime });

        function formatToISO(dateStr, timeStr) {
            const [day, month, year] = dateStr.split("_");
            // Đảm bảo "AM/PM" được parse đúng bằng cách thêm vào Date string chuẩn
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${timeStr}`;
        }

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor is not available" })
        }

        let slots_booked = docData.slots_booked

        // check if available

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
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
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
            dateBooked: formatToISO(slotDate, slotTime),
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()


        // 🔑 Update Redis cache for the user's appointment list
        const cacheKeys = await redisClient.keys(`appointments:user:${userId}:page:*:size:*`);
        for (const key of cacheKeys) {
            await redisClient.del(key);
        }

        // update slot booked in doctor model
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Appointment booked successfully" })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api 

const listAppointment = async (req, res) => {
    try {
        const pageNum = parseInt(req.query.pageNum) || 1;
        const userId = req.userId;
        const perPage = parseInt(req.query.pageSize) || 5;

        if (!userId || pageNum < 1) {
            return res.status(400).json({ success: false, message: 'Invalid userId or pageNum' });
        }

        const skip = (pageNum - 1) * perPage;

        // 🔑 Create cache key
        const cacheKey = `appointments:user:${userId}:page:${pageNum}:size:${perPage}`;
        // 🔍 Check Redis
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        // 📦 query with mongoDB 
        const [appointments, totalAppointments] = await Promise.all([
            appointmentModel
                .find({ userId })
                .sort({ dateBooked: -1 })
                .skip(skip)
                .limit(perPage)
                .lean(),
            appointmentModel.countDocuments({ userId }),
        ]);

        const result = {
            success: true,
            appointments,
            totalAppointments,
            totalPages: Math.ceil(totalAppointments / perPage),
            currentPage: pageNum,
        };

        // 💾 Save in Redis in 10s (optional)
        await redisClient.setEx(cacheKey, 5, JSON.stringify(result));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const getApptByYearMonth = async (req, res) => {
    try {
        const pageNum = 1;
        const userId = req.userId;
        const year = req.query.year;
        const month = req.query.month;
        const perPage = 5 ;
        const skip = 0

        const [appointments] = await Promise.all([
            appointmentModel
                .find({ userId, dateBooked: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 0) } })
                .sort({ dateBooked: -1 })            
        ]);

        const result = {
            success: true,
            appointments,
        };
        res.json({ success: true, result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateApptStar = async (req, res) => {
    try {
        const { rating } = req.body;
        const userId = req.userId;

        for (const [appointmentId, star] of Object.entries(rating)) {
            // Kiểm tra giá trị star
            if (typeof star !== 'number' || star < 0 || star > 5) {
                return res.json({ success: false, message: "Invalid star rating" });
            }

            // Tìm appointment theo ID
            const apptData = await appointmentModel.findById(appointmentId);
            if (!apptData) {
                return res.json({ success: false, message: "Appointment not found" });
            }

            if (apptData.star !== 0) {
                return res.json({ success: false, message: "Appointment already rated" });
            }

            // Cập nhật appointment với star rating
            await appointmentModel.findByIdAndUpdate(appointmentId, { star });

            // Tìm bác sĩ theo docId
            const docId = apptData.docId;
            const doctor = await doctorModel.findById(docId);
            if (!doctor) {
                throw new Error("Doctor not found");
            }

            // Tính toán rating mới
            const newTotal = (doctor.rating * doctor.apptCount) + star;
            const newCount = doctor.apptCount + 1;
            const newRating = Number((newTotal / newCount).toFixed(4)); // Làm tròn thành số thực

            // Cập nhật doctor
            await doctorModel.findByIdAndUpdate(docId, {
                rating: newRating,
                apptCount: newCount
            });

            console.log(`Updated doctor ${doctor.name} to rating: ${newRating} (${newCount} appointments)`);
        }

        res.json({ success: true, message: "Ratings updated successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
//
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // add verify appointment user
        // if (appointmentData.userId !== userId){
        //     return res.json({ success: false, message: "You are not authorized to cancel this appointment"})
        // } 

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing slot booked in doctor model

        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Appointment cancelled successfully" })
        const cacheKeys = await redisClient.keys(`appointments:user:${userId}:page:*:size:*`);
        for (const key of cacheKeys) {
            await redisClient.del(key);
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {
    registerUser, loginUser, getProfile, updateProfile, updateApptStar,
    bookAppointment, listAppointment, cancelAppointment, googleLoginHandler , getApptByYearMonth
}
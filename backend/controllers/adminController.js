

import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';


const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        console.log({ name, email, password, speciality, degree, experience, about, fees, address }, imageFile)
        //check data
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Detail" })
        }
        //valitdating email format

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter valid email" })
        }
        //validating strong password 

        if (password.length < 8) {
            return res.json({ success: false, message: "Password should be at least 8 characters long" })
        }

        //hashing doctor password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        console.log(doctorData)

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({ success: true, message: "Doctor added successfully" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error adding doctor" })
    }
}


//api for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra thông tin đăng nhập
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Tạo token
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            // Trả về phản hồi thành công
            res.json({ success: true, message: "Login successful", token: token });
        } else {
            // Trả về phản hồi thất bại
            res.json({ success: false, message: "invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//api to get all doctorlist for admin pane

const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


const appointmentsAdmin = async (req, res) => {

    try {
        const pageNum = parseInt(req.query.pageNum) || 1; // lấy từ query;
        const perPage = 8 ;


        if (pageNum < 1) {
            return res.status(400).json({ success: false, message: 'Invalid userId or pageNum' });
        }
        const skip = (pageNum - 1) * perPage;

        const appointments = await appointmentModel
        
            .find({}) //  , [ "$set" : { "$price" : { $multiply : [ price, 0.8 ] } } ]
            .sort({ dateBooked: -1 })
            .skip(skip)
            .limit(perPage)
            .lean();

        const totalAppointments = await appointmentModel.countDocuments({});

        res.json({
            success: true,
            appointments,
            totalAppointments,
            totalPages: Math.ceil(totalAppointments / perPage),
            currentPage: pageNum,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//cancel Appointment 

const adminCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // Kiểm tra xem appointmentId có được cung cấp không
        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "appointmentId is required" });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);

        // Kiểm tra xem appointment có tồn tại không
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // Releasing slot booked in doctor model
        const { docId, slotDate, slotTime } = appointmentData;

        // Kiểm tra các trường bắt buộc
        if (!docId || !slotDate || !slotTime) {
            return res.status(400).json({ success: false, message: "Invalid appointment data" });
        }

        const doctorData = await doctorModel.findById(docId);

        // Kiểm tra xem bác sĩ có tồn tại không
        if (!doctorData) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        let slots_booked = doctorData.slots_booked;

        // Kiểm tra và cập nhật slots_booked
        if (slots_booked && slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        res.json({ success: true, message: "Appointment cancelled successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
// api dashboard

const adminDashboard = async (req, res) => {
    try {

        const doctorsL = await doctorModel.countDocuments({})
        const usersL = await userModel.countDocuments({})
        const appt = await appointmentModel.find({})


        const dashData = {
            doctors: doctorsL,
            users: usersL,
            appointments: appt.length,
            latestAppointments: appt.reverse().slice(0, 5)

        }
        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

const deleteDoctor = async (req, res) => {
    try {
        const { doctorId } = req.body;

        // Kiểm tra xem doctorId có được cung cấp không
        if (!doctorId) {
            return res.status(400).json({ success: false, message: "doctorId is required" });
        }

        // Tìm và xóa bác sĩ
        const deletedDoctor = await doctorModel.findByIdAndDelete(doctorId);

        // Xóa tất cả các cuộc hẹn liên quan đến bác sĩ
        await appointmentModel.deleteMany({ docId: doctorId });

        // Kiểm tra xem bác sĩ có tồn tại không
        if (!deletedDoctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        res.json({ success: true, message: "Doctor deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const getTopDoctorsStats = async (req, res) => {
    try {
        // Get top 5 by earning
        const topByEarning = await doctorModel.find({})
            .sort({ earning: -1 })
            .limit(5)
            .select('name speciality image rating earning apptCount')
            .lean();

        // Get top 5 by rating
        const topByRating = await doctorModel.find({})
            .sort({ rating: -1 })
            .limit(5)
            .select('name speciality image rating earning apptCount')
            .lean();

        // Get top 5 by apptCount
        const topByApptCount = await doctorModel.find({})
            .sort({ apptCount: -1 })
            .limit(5)
            .select('name speciality image rating earning apptCount')
            .lean();

        // Combine and remove duplicates by _id
        const combinedMap = new Map();
        [...topByEarning, ...topByRating, ...topByApptCount].forEach(doc => {
            combinedMap.set(doc._id.toString(), doc);
        });

        const combined = Array.from(combinedMap.values());

        res.json({ success: true, topDoctors: combined });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to get top doctors stats' });
    }
};

const getUser = async (req, res) => {
    const pageNum = req.query.pageNum;
    const perPage = 8;
    try {
        const users = await userModel
            .find({})
            .select('-password')
            .skip((pageNum - 1) * perPage)
            .lean();

        res.json({ success: true, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to get users' });
    }
}

const deleteUser = async (req, res) => {
    const { userId } = req.body;
    try {
        if (!userId) {
            return res.status(400).json({ success: false, message: 'Missing userId' });
        }
        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        await appointmentModel.deleteMany({ userId: userId });
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const getStatData = async (req, res) => {
    try {
        // Lấy tổng số người dùng
        const userCount = await userModel.countDocuments({});

        // Lấy tổng số cuộc hẹn
        const totalAppointments = await appointmentModel.countDocuments({});

        // Lấy tổng doanh thu theo tháng/năm
        const earningsByMonth = await appointmentModel.aggregate([
            {
                $match: { payment: true }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$dateBooked" },
                        month: { $month: "$dateBooked" }
                    },
                    totalEarning: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Lấy thống kê đánh giá
        const ratingStats = await appointmentModel.aggregate([
            {
                $match: { star: { $gt: 0 } }
            },
            {
                $group: {
                    _id: null,
                    totalRating: { $sum: "$star" },
                    ratingCount: { $sum: 1 },
                    averageRating: { $avg: "$star" }
                }
            }
        ]);

        // Tính tổng doanh thu
        const totalEarnings = earningsByMonth.reduce((sum, item) => sum + item.totalEarning, 0);

        const totalDelete = await appointmentModel.countDocuments({ cancelled: true });
        const avgDelete  = totalAppointments > 0 ? (totalDelete / totalAppointments).toFixed(2) : "0";

        // Lấy thông tin rating từ kết quả aggregate
        const ratingInfo = ratingStats[0] || {
            totalRating: 0,
            ratingCount: 0,
            averageRating: 0
        };

        return res.json({
            success: true,
            userCount,
            totalAppointments,
            totalEarnings,
            earningsByMonth,
            ratingStats: {
                totalRating: ratingInfo.totalRating,
                ratingCount: ratingInfo.ratingCount,
                averageRating: ratingInfo.averageRating.toFixed(2)
            } ,
            avgDelete
        });
    } catch (error) {
        console.error("Error getting statistics:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export {
    addDoctor, adminLogin, allDoctors, appointmentsAdmin, adminCancel,
    adminDashboard, deleteDoctor, getTopDoctorsStats, getStatData, 
    getUser , deleteUser , 
}



import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';


const getSchedule = async (req, res) => {
  try {
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    const appointments = await appointmentModel.find({
      dateBooked: {
        $gte: today,
        $lte: next7Days
      },
      cancelled: false // tránh hiện lịch đã hủy
    });

    const schedule = appointments.map(appt => ({
      id: appt._id,
      title: appt.docData?.name || "Không rõ bác sĩ",
      start: appt.dateBooked,
      end: new Date(new Date(appt.dateBooked).getTime() + 30 * 60 * 1000) // mặc định 30 phút
    }));

    res.status(200).json({ success: true, event : schedule });
  } catch (err) {
    console.error("Lỗi getSchedule:", err);
    res.status(500).json({ success: false, message: "Lỗi server khi lấy lịch hẹn" });
  }
};

const getApptByYearMonth = async (req, res) => {
    try {
        const pageNum = 1;
        const year = req.query.year;
        const month = req.query.month;
        const perPage = 5 ;
        const skip = 0

        const [appointments] = await Promise.all([
            appointmentModel
                .find({ dateBooked: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 0) } })
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



export { getSchedule, getApptByYearMonth };
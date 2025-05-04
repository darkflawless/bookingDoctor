import mongoose from "mongoose";
import appointmentModel from "../models/appointmentModel.js";

mongoose.connect('mongodb+srv://dat123:dat123@cluster0.hfaxe.mongodb.net/prescripto', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  updateDateBooked();
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

async function updateDateBooked() {
  try {
    const appointments = await appointmentModel.find({ dateBooked: { $exists: false } });

    for (let appointment of appointments) {
      const { slotDate, slotTime } = appointment;

      if (!slotDate || !slotTime) continue;

      const [day, month, year] = slotDate.split('_');
      const fullDateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${slotTime}`;
      const parsedDate = new Date(fullDateStr);

      if (isNaN(parsedDate)) {
        console.log(`Không thể parse ngày cho appointment _id: ${appointment._id}`);
        continue;
      }

      appointment.dateBooked = parsedDate;
      await appointment.save();
      console.log(`Đã cập nhật appointment ${appointment._id}`);
    }

    console.log('Xong!');
  } catch (error) {
    console.error('Error updating dateBooked:', error);
  } finally {
    await mongoose.connection.close();
  }
}
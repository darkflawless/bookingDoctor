

import cron from 'node-cron';
import appointmentModel from '../models/appointmentModel.js';

// Lịch chạy: mỗi ngày lúc 0h
cron.schedule('0 15 * * *', async () => {
  console.log('Đang kiểm tra đơn hàng quá hạn...');

  await appointmentModel.updateMany(
    {
      dateBooked : { $lt: new Date() },
      payment : false ,
      isCompleted : false,
    },
    {
      $set: { cancelled: true }
    }
  );

  console.log('Cập nhật xong đơn hàng quá hạn.');

});


import axios from "axios";
import dotenv from "dotenv";
import appointmentModel from "../models/appointmentModel.js";

dotenv.config();

const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // API sandbox PayPal

// ✅ Lấy Access Token từ PayPal
const getPayPalAccessToken = async () => {
  try {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");

    const response = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Lỗi lấy Access Token:", error.response?.data || error.message);
    throw new Error("Không thể lấy Access Token từ PayPal");
  }
};

// ✅ Xác nhận thanh toán PayPal
const confirmPayment = async (req, res) => {
  try {
    const { transactionId, appointmentId, amount , currency , CLIENT_ID } = req.body;

    if (CLIENT_ID !== process.env.PAYPAL_CLIENT_ID) {
      return res.status(401).json({ message: "Invalid Client ID" });
    }

    if (!transactionId || !appointmentId || !amount || !currency) {
      return res.status(400).json({ message: "Thiếu dữ liệu cần thiết" });
    }

    // 🔹 Lấy Access Token từ PayPal
    const accessToken = await getPayPalAccessToken();

    // 🔹 Kiểm tra giao dịch trên PayPal
    const response = await axios.get(`${PAYPAL_API}/v2/checkout/orders/${transactionId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const order = response.data;

    console.log("Trạng thái giao dịch từ PayPal:", order.status);

    // 🔹 Kiểm tra trạng thái giao dịch
    if (order.status !== "COMPLETED") {
      return res.status(400).json({ message: "Giao dịch chưa hoàn tất" });
    }

    // 🔹 Kiểm tra số tiền thanh toán
    const paidAmount = parseFloat(order.purchase_units[0].amount.value);
    const paidCurrency = order.purchase_units[0].amount.currency_code;

    console.log(`Số tiền đã trả: ${paidAmount} ${paidCurrency}`);

    if (paidAmount !== parseFloat(amount) || paidCurrency !== currency) {
      return res.status(400).json({ message: "Số tiền hoặc đơn vị tiền tệ không khớp" });
    }

    // 🔹 Tìm cuộc hẹn trong DB
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy cuộc hẹn" });
    }

    // 🔹 Cập nhật trạng thái thanh toán
    appointment.payment = true;
    await appointment.save();

    res.status(200).json({ message: "Thanh toán thành công", appointment });
  } catch (error) {
    console.error("Lỗi xác nhận thanh toán:", error.response?.data || error.message);
    res.status(500).json({ message: "Lỗi xử lý thanh toán", error: error.message });
  }
};

export { confirmPayment }



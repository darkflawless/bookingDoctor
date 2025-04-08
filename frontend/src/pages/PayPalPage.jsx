import { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from 'react-toastify'

export const PayPalPage = () => {
  const location = useLocation();
  const appointment = location.state?.appointment; // Lấy dữ liệu từ navigate()
  const amount = appointment?.docData?.fees || "10.00"; // Lấy phí khám từ appointment
  const { token , backendURL} = useContext(AppContext)
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_ID}&currency=USD`;
    script.async = true;
    script.onload = () => {
      window.paypal.Buttons({
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount } }], // Thay đổi số tiền thành item.amount
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function (details) {
            alert("Thanh toán thành công! Cảm ơn " + details.payer.name.given_name);
            handlePaymentSuccess(details);
          });
        },
        onError: function (err) {
          console.error("Lỗi thanh toán:", err);
        },
      }).render("#paypal-button-container");
    };
    document.body.appendChild(script);
  }, [amount]); // Thêm amount vào dependencies để đảm bảo cập nhật đúng giá trị

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      const response = await axios.post(backendURL + '/api/payment/pay' , {
        CLIENT_ID : import.meta.env.VITE_PAYPAL_ID,
        transactionId: paymentDetails.id,
        payerEmail: paymentDetails.payer.email_address,
        amount: paymentDetails.purchase_units[0].amount.value,
        currency: paymentDetails.purchase_units[0].amount.currency_code,
        appointmentId: appointment._id, // Gửi ID cuộc hẹn nếu cần
      } , {headers : {token}}   );

      console.log(response)
      
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu lên Backend:", error);
    }
    navigate('/my-appointments')
  };

  return (
    <div className= " container">
      <h2 >Thanh toán bằng PayPal</h2>
      <p>Số tiền cần thanh toán: {amount} USD</p>
      <div id="paypal-button-container"></div>
    </div>
  );
};



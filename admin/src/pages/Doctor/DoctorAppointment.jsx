

import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const doctorAppointment = () => {

  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment, getDoctorDashboard } = useContext(DoctorContext)
  const { calcAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken])




  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-7 p-4 bg-gray-100 font-semibold text-gray-700">
          <div className="px-3 py-2">#</div>
          <div className="px-3 py-2">Patient</div>
          <div className="px-3 py-2">Payment</div>
          <div className="px-3 py-2">Age</div>
          <div className="px-3 py-2">Date & Time</div>
          <div className="px-3 py-2">Fees</div>
          <div className="px-3 py-2">Action</div>
        </div>
        {appointments.map((item, index) => (
          <div key={index} className="grid grid-cols-7 p-4 border-b border-gray-200 hover:bg-gray-50 items-center">
            <div className="px-3 py-2 text-gray-500">{index + 1}</div>
            <div className="px-3 py-2 flex items-center space-x-3">
              <img src={item.userData.image} alt="" className="w-10 h-10 rounded-full object-cover" />
              <p className="font-medium">{item.userData.name}</p>
            </div>
            <div className="px-3 py-2">
              <span className={`px-3 py-1 rounded-full text-xs ${item.payment === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {item.payment === 'paid' ? 'Paid' : 'Not Paid'}
              </span>
            </div>
            <div className="px-3 py-2">{calcAge(item.userData.dob)}</div>
            <div className="px-3 py-2">{item.slotDate}, {item.slotTime}</div>
            <div className="px-3 py-2">{currency} {item.amount}</div>
            <div className="px-3 py-2 flex items-center space-x-2">
              {item.cancelled ? (
                <p>Cancelled</p>
              ) : item.completed ? (
                <p>Completed</p>
              ) : (
                <>
                  <button className="p-1 rounded hover:bg-red-100">
                    <img onClick={() => cancelAppointment(item._id)} src={assets.cancel_icon} alt="Cancel" className="w-5 h-5" />
                  </button>
                  <button className="p-1 rounded hover:bg-green-100">
                    <img onClick={() => completeAppointment(item._id)} src={assets.tick_icon} alt="Approve" className="w-5 h-5" />
                  </button>
                </>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default doctorAppointment

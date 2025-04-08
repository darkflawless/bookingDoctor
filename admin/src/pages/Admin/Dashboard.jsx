import React from 'react'
import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'


const Dashboard = () => {
  const { aToken, getDashData, dashData , cancelAppointment } = useContext(AdminContext)


  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Thống kê tổng quan */}
      {[
        { label: "Doctors", count: dashData.doctors, icon: assets.doctor_icon },
        { label: "Patients", count: dashData.users, icon: assets.patients_icon },
        { label: "Appointments", count: dashData.appointments, icon: assets.appointments_icon },
      ].map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-xl shadow flex items-center space-x-4">
          <img src={item.icon} alt={item.label} className="w-12 h-12" />
          <div>
            <p className="text-gray-500">{item.label}</p>
            <h2 className="text-xl font-semibold">{item.count}</h2>
          </div>
        </div>
      ))}

      {/* Cuộc hẹn gần nhất */}
      <div className="col-span-1 md:col-span-3 bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Latest Appointments</h2>
        <div className="space-y-4">
          {dashData.latestAppointments.map((appt, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-100 rounded-lg">
              <img src={appt.docData.image} alt={appt.docData.name} className="w-12 h-12 rounded-full" />
              <div className="ml-4 flex-1">
                <h3 className="font-medium">{appt.docData.name}</h3>
                <p className="text-sm text-gray-500 font-bold">{appt.slotDate}</p>
              </div>
              {
                appt.cancelled 
                ? 
                <p className="text-red-500">Cancelled</p>
                : appt.isCompleted ?
                <p className="text-green-500">Completed</p> : 
                <img onClick={()=> cancelAppointment(appt._id)} src={assets.cancel_icon} alt="" className="cursor-pointer" />
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )

}

export default Dashboard

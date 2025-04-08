

import React from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets'

const doctorDashboard = () => {

  const { dToken, dashboardData, getAppointments, completeAppointment, cancelAppointment, getDoctorDashboard } = useContext(DoctorContext)

  useEffect(() => {
    if (dToken) {
      getDoctorDashboard()
    }

  }, [dToken])


  return dashboardData && (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { label: "Earning", count: dashboardData.earnings, icon: assets.earning_icon },
        { label: "Patients", count: dashboardData.patients, icon: assets.patients_icon },
        { label: "Appointments", count: dashboardData.totalAppointments, icon: assets.appointments_icon },
      ].map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow flex items-center space-x-6">
          <img src={item.icon} alt={item.label} className="w-16 h-16" />
            <h2 className="text-3xl font-semibold">{item.count}</h2>
        </div>
      ))}

      {/* comment */}

      <div className="col-span-1 md:col-span-3 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6">Latest Appointments</h2>
        <div className="space-y-6">
          {dashboardData.latestAppointments.map((item, index) => (
            <div key={index} className="flex items-center p-4 bg-gray-100 rounded-lg">
              <img src={item.userData.image} alt={item.userData.name} className="w-16 h-16 rounded-full" />
              <div className="ml-6 flex-1">
                <h3 className="text-xl font-medium">{item.userData.name}</h3>
                <p className="text-sm text-gray-500 font-bold">{item.slotDate}</p>
              </div>
              <span
                className={`px-2 py-0.5 text-xs rounded ${item.cancelled ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}
              >
                {item.cancelled ? "Đã hủy" : "Đã đặt"}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>

  )
}

export default doctorDashboard

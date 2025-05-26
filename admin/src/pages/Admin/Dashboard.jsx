import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'


const Dashboard = () => {
  const { aToken, getDashData, dashData, cancelAppointment, completeAppointment, doctors, getAllDoctors } = useContext(AdminContext)

  const [topDoctors, setTopDoctors] = useState([])

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  useEffect(() => {
    const shuffled = [...doctors]
      .sort(() => Math.random() - 0.5)  // Trộn ngẫu nhiên
      .slice(0, 5);                     // Lấy 5 phần tử đầu
    setTopDoctors(shuffled);
  }, [doctors]);

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken, dashData])

  return dashData && topDoctors && (
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

      {/* Top Doctors */}
      <div className="col-span-3 bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Top Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {topDoctors.map((doctor, index) => (
            <div key={index} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full mb-2" />
              <h3 className="font-medium text-center">{doctor.name}</h3>
              <div className="flex items-center mt-1">
                <img src={assets.star_icon} alt="rating" className="w-4 h-4 mr-1" />
                <span>{doctor.rating.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cuộc hẹn gần nhất */}
      <div className="col-span-3 bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Latest Appointments</h2>
        <div className="space-y-4">
          {dashData.latestAppointments.map((item, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-100 rounded-lg">
              <img src={item.docData.image} alt={item.docData.name} className="w-12 h-12 rounded-full" />
              <div className="ml-4 flex-1">
                <h3 className="font-medium">{item.docData.name}</h3>
                <p className="text-sm text-gray-500 font-bold">{item.slotDate}</p>
              </div>
              <div className="px-3 py-2 flex items-center space-x-2">
                {item.cancelled ? (
                  <p className="text-red-500 font-semibold">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-600 font-semibold">Completed</p>
                ) : (
                  <>
                    <button className="p-1 rounded hover:bg-red-100">
                      <img onClick={() => cancelAppointment(item._id)} src={assets.cancel_icon} alt="Cancel" className="w-8 h-8" />
                    </button>
                    <button className="p-1 rounded hover:bg-green-100">
                      <img onClick={() => completeAppointment(item._id)} src={assets.tick_icon} alt="Approve" className="w-8 h-8" />
                    </button>
                  </>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )

}

export default Dashboard

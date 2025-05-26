

import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllAppointments = () => {

  const { aToken, appointments, getAllAppointments, cancelAppointment, pageNum,
    totalPages, setPageNum } = useContext(AdminContext)
  const { calcAge, currency } = useContext(AppContext)


  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken, pageNum])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Appointments</h1>


      <div>
        <div className="grid grid-cols-7 gap-4 font-semibold">
          <p>#</p>
          <p>Patient Name</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.map((item, index) => (
          <div key={index} className="grid grid-cols-7 gap-4 items-center border-b py-2">
            <p>{index + 1}</p>
            <div className="flex items-center">
              <img src={item.userData.image} alt="" className="w-10 h-10 rounded-full" />
              <p className="ml-2">{item.userData.name}</p>
            </div>
            <p>{calcAge(item.userData.dob)}</p>
            <p className="text-sm whitespace-nowrap">{item.slotDate}, {item.slotTime}</p>
            <div className="flex items-center">
              <img src={item.docData.image} alt="" className="w-10 h-10 rounded-full" />
              <p className="ml-2">{item.docData.name}</p>
            </div>
            <p>{currency}{item.amount}</p>
            {
              item.cancelled
                ?
                <p className="text-red-500">Cancelled</p>
                : item.isCompleted ?
                  <p className="text-green-500">Completed</p> :
                  <img onClick={() => cancelAppointment(item._id)} src={assets.cancel_icon} alt="" className="cursor-pointer" />
            }
          </div>

        ))
        }

      </div>

      <div>
        Page {pageNum} of {totalPages}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPageNum(index + 1)}
              className={`px-3 py-1 mx-1 border rounded ${pageNum === index + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

export default AllAppointments

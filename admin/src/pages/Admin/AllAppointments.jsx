

import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AllAppointments = () => {

  const { aToken, appointments, getAllAppointments, cancelAppointment, pageNum, completeAppointment,
    totalPages, setTotalPages , setPageNum , setAppointments , backendURL } = useContext(AdminContext)
  const { calcAge, currency } = useContext(AppContext)
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Months are 0-indexedF

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken, pageNum])

    const getApptByYearMonth = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/admin/apptFilter`, {
        params: { year, month },
        headers: { aToken },
      });
      if (data.success) {
        setAppointments(data.result.appointments);
        setTotalPages(1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Appointments</h1>
      <div className='flex justify-between items-center mt-12 pb-3 border-b'>
        <p className='font-medium text-zinc-700'>
          My Appointment
        </p>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-2'>
            <label htmlFor="year" className="text-sm text-zinc-700">Year:</label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              {[...Array(5)].map((_, i) => (
                <option key={i} value={new Date().getFullYear() - 2 + i}>
                  {new Date().getFullYear() - 2 + i}
                </option>
              ))}
            </select>
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor="month" className="text-sm text-zinc-700">Month:</label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <button
            onClick={getApptByYearMonth}
            className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark transition-all"
          >
            Filter
          </button>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-8 gap-4 font-semibold">
          <p>#</p>
          <p>Patient Name</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
          <p>Star</p>
        </div>

        {appointments.map((item, index) => (
          <div key={index} className="grid grid-cols-8 gap-4 items-center border-b py-2">
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
            }
            <div>
              <img src={assets.star_icon} alt="Star" className="w-6 h-6" />
              <span className="ml-1">{item.star || -1}</span>
            </div>
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

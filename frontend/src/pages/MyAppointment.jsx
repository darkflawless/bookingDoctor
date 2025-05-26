import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export const MyAppointment = () => {

  const { backendURL, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Months are 0-indexed

  // Change rating state to an object to hold ratings per appointment
  const [ratings, setRatings] = useState({});
  // Update handleStarClick to accept appointment id and star index

  const handleStarClick = (appointmentId, starIndex) => {
    setRatings(prevRatings => {
      const newRatings = {
        ...prevRatings,
        [appointmentId]: starIndex + 1
      };
      console.log('New ratings:', newRatings); // In trạng thái mới
      return newRatings;
    });
  };

  const handleRatingSubmit = async () => {
    try {

      const rating = ratings;
      console.log(rating)
      if (Object.keys(rating).length === 0) {
        return; // No ratings to submit
      }
      const { data } = await axios.post(`${backendURL}/api/user/rate-doctor`, { rating }, { headers: { token } });
      if (data.success) {
        toast.success('Rating submitted successfully!');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }

  };

  const getUserAppointment = async (pageNum) => {
    try {
      const { data } = await axios.get(`${backendURL}/api/user/appointments`, {
        params: { pageNum, pageSize: 5 },
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getApptByYearMonth = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/user/apptFilter`, {
        params: { year, month },
        headers: { token },
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

  const cancelAppointment = async (appointmentId) => {

    try {
      const { data } = await axios.post(backendURL + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointment()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (token) {
      getUserAppointment(pageNum);
    } else {
      toast.error("Please login to continue")
      navigate("/login")
    }
  }, [token]);


  useEffect(() => {
    getUserAppointment(pageNum);
  }, [pageNum]);
  
  return (
    <div>
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
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>

            <div className='flex-1 text-sm text-zinc-700'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address : </p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p><span>Date & Time : </span> {item.slotDate} | {item.slotTime} </p>
            </div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => navigate("/Paypal", { state: { appointment: item } })} className='text-sm text-gray-400 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all'>Pay Online</button>}
              {!item.cancelled && item.payment && !item.isCompleted && <p className='text-sm text-green-400 text-center sm:min-w-48 py-2 border rounded  transition-all' > Pay Successfully</p>}
              {!item.cancelled && item.isCompleted && <p className='text-sm text-green-400 text-center sm:min-w-48 py-2 border rounded  transition-all'> Appointment Completed</p>}
              {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-gray-400 text-center sm:min-w-48 py-2 border rounded hover:bg-red-400 hover:text-white transition-all'>Cancel Appointment</button>}
              {item.cancelled && !item.isCompleted && <p className='text-sm text-red-400 text-center sm:min-w-48 py-2 border rounded  transition-all'>Appointment Cancelled</p>}
              <div className="flex space-x-1">
                {item.star === 0
                  ? [...Array(5)].map((_, starIndex) => (
                    <svg
                      key={starIndex}
                      onClick={item.payment ? () => handleStarClick(item._id, starIndex) : undefined}
                      className={`w-8 h-8 cursor-pointer ${starIndex < (ratings[item._id] || 0) ? 'text-orange-400' : 'text-gray-300'
                        } ${!item.payment ? 'opacity-50 cursor-not-allowed' : ''}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.465a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.465a1 1 0 00-1.176 0l-3.392 2.465c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.39 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                    </svg>
                  ))
                  : [...Array(item.star)].map((_, starIndex) => (
                    <svg
                      key={starIndex}
                      className="w-8 h-8 cursor-pointer text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.465a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.392-2.465a1 1 0 00-1.176 0l-3.392 2.465c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.39 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                    </svg>
                  ))}
              </div>
            </div>

          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleRatingSubmit}
          className="mt-4 pl-9 pr-9 px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-all"
        >
          Submit Rating
        </button>
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

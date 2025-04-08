import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export const MyAppointment = () => {

  const { backendURL , token , getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments , setAppointments ] = useState([])
 
  const getUserAppointment = async () =>{

    try {
      const {data} = await axios.get(backendURL + '/api/user/appointments', {headers : {token}})
      if (data.success){
        setAppointments(data.appointments.reverse())
  
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }
  
  const cancelAppointment = async (appointmentId) => {
     
    try {
      const {data} = await axios.post(backendURL + '/api/user/cancel-appointment' , {appointmentId} , {headers : {token}})
      if (data.success){
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


  useEffect(()=>{
    if (token) {
      getUserAppointment()
    }
  },[token])

  return (
    <div>
      <p className = 'pb-3 mt-12 font-medium text-zinc-700 border-b'>
        My Appointment
      </p>
      <div>
          {appointments.map((item, index)=>(
            <div className = ' grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key = {index}>
              <div>
                <img className = 'w-32 bg-indigo-50' src={item.docData.image} alt="" />
              </div>
                
                <div className = 'flex-1 text-sm text-zinc-700'>
                  <p className = 'text=neutral-800 font-semibold'>{item.docData.name}</p>
                  <p>{item.docData.speciality}</p>
                  <p className='text-zinc-700 font-medium mt-1'>Address : </p>
                  <p className= 'text-xs'>{item.docData.address.line1}</p>
                  <p className= 'text-xs'>{item.docData.address.line2}</p>
                  <p><span>Date & Time : </span> {item.slotDate} | {item.slotTime} </p>
                </div>
                <div className = 'flex flex-col gap-2 justify-end'>
                  {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => navigate("/Paypal", { state: { appointment: item } })} className = 'text-sm text-gray-400 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all'>Pay Online</button>}
                  {!item.cancelled && item.payment && !item.isCompleted &&  <p className = 'text-sm text-green-400 text-center sm:min-w-48 py-2 border rounded  transition-all' > Pay Successfully</p>    }
                  {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={()=> cancelAppointment(item._id)} className = 'text-sm text-gray-400 text-center sm:min-w-48 py-2 border rounded hover:bg-red-400 hover:text-white transition-all'>Cancel Appointment</button>}
                  { item.cancelled && !item.isCompleted && <p className = 'text-sm text-red-400 text-center sm:min-w-48 py-2 border rounded  transition-all'>Appointment Cancelled</p>}
                </div>
            </div>
          ))}          
      </div>
    </div>
  )
}

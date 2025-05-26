

import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { useState } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const { doctorProfile, dToken, getDoctorProfile, setDoctorProfile, backendURL } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    if (dToken) {
      getDoctorProfile()
    }
  }, [dToken])

  const handleUpdateProfile = async () => {
    try {

      const updateDocData = {

        address: doctorProfile.address,
        fees: doctorProfile.fees,
        available: doctorProfile.available,

      }

      const { data } = await axios.post(backendURL + '/api/doctor/update-profile', updateDocData, { headers: { dToken } })
      if (data.success) {
        setDoctorProfile(data.doctor)
        getDoctorProfile()
        setIsEdit(false)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return doctorProfile && (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Doctor Image and Available status */}
        <div className="flex flex-col items-center">
          <img
            src={doctorProfile.image}
            alt={`Dr. ${doctorProfile.name}`}
            className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-md"
          />
          <div className="mt-4 flex items-center">
            {isEdit ? (
              <div className="flex items-center gap-4">
                <input
                  onChange={() =>
                    setDoctorProfile(prev => ({ ...prev, available: !prev.available }))
                  }
                  checked={doctorProfile.available}
                  type="checkbox"
                  id="availability"
                  className="w-5 h-5 text-green-500 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                />
                <p className={doctorProfile.available ? 'text-green-500' : 'text-red-500'}>
                  {doctorProfile.available ? 'Available' : 'Not Available'}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className={`w-2 h-2 rounded-full ${doctorProfile.available ? 'bg-green-500' : 'bg-red-500'}`}></p>
                <p className={doctorProfile.available ? 'text-green-500' : 'text-red-500'}>
                  {doctorProfile.available ? 'Available' : 'Not Available'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Doctor Info */}
        <div className="flex-1 space-y-6">
          {/* Name and Credentials */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dr. {doctorProfile.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-lg text-gray-600">{doctorProfile.degree} - {doctorProfile.speciality}</p>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                {doctorProfile.experience} years experience
              </span>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">About</h2>
            <p className="text-gray-600 leading-relaxed">
              {doctorProfile.about}
            </p>
          </div>

          {/* Fees and Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800 mb-1">Appointment Fees</h3>
              <p className="text-2xl font-bold text-blue-600">
                {currency} {isEdit ? <input type="number"
                  onChange={(e) => setDoctorProfile(prev => ({ ...prev, fees: e.target.value }))} value={doctorProfile.fees}
                  className="w-20 border-b-2 border-blue-500 focus:outline-none" /> : doctorProfile.fees}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-1">Address</h3>
              <address className="text-gray-600 not-italic">
                {isEdit ?
                  <input type="text"
                    onChange={(e) => setDoctorProfile(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                    value={doctorProfile.address.line1}
                    className="w-96 border-b-2 border-gray-500 focus:outline-none" />
                  : doctorProfile.address.line1}<br />

                {isEdit ?
                  <input type="text"
                    onChange={(e) => setDoctorProfile(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                    value={doctorProfile.address.line2}
                    className="w-96 border-b-2 border-gray-500 focus:outline-none" />
                  : doctorProfile.address.line2}<br />

              </address>
            </div>
          </div>

          {/* Edit Button */}
          {
            isEdit ? (
              <button onClick={() => { handleUpdateProfile() }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                Save Changes
              </button>
            ) : (
              <button onClick={() => setIsEdit(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                Edit Profile
              </button>
            )

          }
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile

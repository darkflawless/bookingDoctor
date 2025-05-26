

import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorList = () => {
  const { doctors, aToken , getAllDoctors, changeAvailability} = useContext(AdminContext)
  
  useEffect(() => {

    if (aToken) {
      getAllDoctors()
    }
  },[aToken])

  return (
    <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">All Doctors</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor, index) => (
                <div 
                    key={index} 
                    className="border p-4 rounded-lg shadow-sm transition-transform transform hover:scale-100 hover:shadow-lg hover:bg-blue-200"
                >
                    <img src={doctor.image} alt={doctor.name} className="w-full h-48 object-cover rounded-md mb-4"/>
                    <h2 className="text-xl font-semibold">{doctor.name}</h2>
                    <p className="text-gray-600">{doctor.speciality}</p>
          
                    <div onClick ={(e) => changeAvailability(doctor._id)} className="mt-4 cursor-pointer">
                        {doctor.available ? (
                            <span className="bg-green-200 text-green-800 px-2 py-1 rounded">Available</span>
                        ) : (
                            <span className="bg-red-200 text-red-800 px-2 py-1 rounded">Not Available</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
}
export default DoctorList

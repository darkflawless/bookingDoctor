import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorList = () => {
  const { doctors, aToken , getAllDoctors, changeAvailability, deleteDoctor } = useContext(AdminContext)
  const [sortCriteria, setSortCriteria] = useState(null)
  const [sortedDoctors, setSortedDoctors] = useState([])

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  },[aToken])

  useEffect(() => { 
    if (!sortCriteria) {
      setSortedDoctors(doctors)
      return
    }
    const sorted = [...doctors].sort((a, b) => {
      if (a[sortCriteria] === undefined || b[sortCriteria] === undefined) {
        return 0
      }
      return b[sortCriteria] - a[sortCriteria]
    })
    setSortedDoctors(sorted)
  }, [doctors, sortCriteria])

  return (
    <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">All Doctors</h1>
        <div className="mb-4 flex space-x-4">
          <button
            onClick={() => setSortCriteria('earning')}
            className={`px-4 py-2 rounded ${sortCriteria === 'earning' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Sort by Earning
          </button>
          <button
            onClick={() => setSortCriteria('rating')}
            className={`px-4 py-2 rounded ${sortCriteria === 'rating' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Sort by Rating
          </button>
          <button
            onClick={() => setSortCriteria('apptCount')}
            className={`px-4 py-2 rounded ${sortCriteria === 'apptCount' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Sort by ApptCount
          </button>
          <button
            onClick={() => setSortCriteria(null)}
            className={`px-4 py-2 rounded ${sortCriteria === null ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Clear Sort
          </button>
        </div>
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {sortedDoctors.map((doctor, index) => (
                <div
                    key={index}
                    className="border p-2 rounded-lg shadow-sm transition-transform transform hover:scale-100 hover:shadow-lg hover:bg-blue-200 relative max-w-xs"
                >
                    <button 
                        onClick={() => {
                          if(window.confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) {
                            deleteDoctor(doctor._id)
                          }
                        }} 
                        className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs"
                    >    X   </button>
                    <img src={doctor.image} alt={doctor.name} className="w-full h-24 object-cover rounded-md mb-2"/>
                    <h2 className="text-base font-semibold">{doctor.name}</h2>
                    <p className="text-gray-600 text-sm">{doctor.speciality}</p>
                    <p className="text-gray-600 text-sm">Earning: {doctor.earning !== undefined ? doctor.earning : 'N/A'}</p>
                    <p className="text-gray-600 text-sm">Rating: {doctor.rating !== undefined ? doctor.rating : 'N/A'}</p>
                    <p className="text-gray-600 text-sm">ApptCount: {doctor.apptCount !== undefined ? doctor.apptCount : 'N/A'}</p>
                    <div onClick ={() => changeAvailability(doctor._id)} className="mt-2 cursor-pointer">
                        {doctor.available ? (
                            <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded text-xs">Available</span>
                        ) : (
                            <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded text-xs">Not Available</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
export default DoctorList

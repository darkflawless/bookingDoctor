import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

export const Doctors = () => {

  const { speciality } = useParams()
  const { doctors , pageNum , setPageNum , totalPages  } = useContext(AppContext)
  const navigate = useNavigate()
  const [filterDoc, setFilterDoc] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const applyFilter = () => {
    let filtered = doctors
    if (speciality) {
      filtered = filtered.filter(doc => doc.speciality === speciality)
    }
    if (searchTerm) {
      filtered = filtered.filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    setFilterDoc(filtered)
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality, searchTerm])

  return (
    <div>
      <p className ='flex justify-center' >Browse through the doctors specialist.</p>
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search doctors by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className="flex-col gap-4 text-sm text-gray-600">
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""}`}>General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}>Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}>Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""}`}>Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}>Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>Gastroenterologist</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {
            filterDoc.map((item, index) => (
              <div onClick={() => navigate(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                <img className='bg-blue-50' src={item.image} alt="" />
                <div className='p-4'>
                  <div className="flex items-center gap-2">
                    <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></p>
                    <p className={item.available ? 'text-green-500' : 'text-red-500'}>
                      {item.available ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                  <p className='text-gray-900 text-lg font-mediumedium'>{item.name}</p>
                  <p className='text-gray-700 text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))}
        </div>
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
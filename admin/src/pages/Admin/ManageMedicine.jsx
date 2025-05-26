import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useNavigate, useParams } from 'react-router-dom'

const ManageMedicine = () => {
  const { backendURL, aToken, getMedicines, medicines, setMedicines } = useContext(AdminContext)
  const navigate = useNavigate()
  const [pageNum, setPageNum] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterMed, setFilteredMed] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const { typeOf } = useParams()

  // Fetch medicines when component mounts
  useEffect(() => {
    if (aToken) {
      getMedicines()
    }
  }, [aToken])

  const applyFilter = () => {
    let filtered = medicines || []
    if (searchTerm) {
      filtered = filtered.filter(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (typeOf) {
      filtered = filtered.filter(med => med.typeOf === typeOf)
    }
    setFilteredMed(filtered)
  }

  useEffect(() => {
    applyFilter()
  }, [medicines, searchTerm, typeOf])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Danh sách thuốc</h2>
      
      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm thuốc..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Filter categories */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
        <button 
          onClick={() => typeOf === 'vitamin' ? navigate('/manage-medicine') : navigate('/manage-medicine/vitamin')}
          className={`p-2 rounded-lg ${typeOf === 'vitamin' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Vitamin
        </button>
        <button 
          onClick={() => typeOf === 'analgesics' ? navigate('/manage-medicine') : navigate('/manage-medicine/analgesics')}
          className={`p-2 rounded-lg ${typeOf === 'analgesics' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Analgesics
        </button>
        <button 
          onClick={() => typeOf === 'antibiotics' ? navigate('/manage-medicine') : navigate('/manage-medicine/antibiotics')}
          className={`p-2 rounded-lg ${typeOf === 'antibiotics' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Antibiotics
        </button>
        <button 
          onClick={() => typeOf === 'probiotics' ? navigate('/manage-medicine') : navigate('/manage-medicine/probiotics')}
          className={`p-2 rounded-lg ${typeOf === 'probiotics' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Probiotics
        </button>
        <button 
          onClick={() => typeOf === 'antioxidants' ? navigate('/manage-medicine') : navigate('/manage-medicine/antioxidants')}
          className={`p-2 rounded-lg ${typeOf === 'antioxidants' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Antioxidants
        </button>
        <button 
          onClick={() => typeOf === 'others' ? navigate('/manage-medicine') : navigate('/manage-medicine/others')}
          className={`p-2 rounded-lg ${typeOf === 'others' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Others
        </button>
      </div>
      
      {/* Medicine cards */}
      {filterMed && filterMed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filterMed.map((medicine, index) => (
            <div
              onClick={() => navigate(`/medicine/${medicine._id}`)}
              key={index}
              className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center hover:shadow-2xl transition cursor-pointer"
            >
              <img
                src={medicine.image}
                alt={medicine.name}
                className="w-24 h-24 object-cover rounded-full mb-4 border-2 border-blue-200"
              />
              <h3 className="text-lg font-semibold text-blue-700 mb-1">{medicine.name}</h3>
              <p className="text-gray-500 mb-2">Thể loại: <span className="font-medium">{medicine.typeOf}</span></p>
              <p className="text-gray-600 mb-2">Số lượng: <span className="font-semibold">{medicine.quantity}</span></p>
              <p className="text-green-600 text-xl font-bold mb-2">{medicine.price.toLocaleString()}₫</p>
              <p className={`text-sm mb-2 ${medicine.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                {medicine.isAvailable ? 'Còn hàng' : 'Hết hàng'}
              </p>
              <p className="text-xs text-gray-400 text-center line-clamp-2">{medicine.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Không tìm thấy thuốc phù hợp</p>
        </div>
      )}
    </div>
  )
}

export default ManageMedicine
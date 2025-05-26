





import React from 'react'
import { useContext } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

export const BuyMed = () => {

  const { backendURL, token, getMedicines, medicines, setMedicines } = useContext(AppContext)
  const navigate = useNavigate()

  const medId = useParams().medId
  const data = medicines.find(med => med._id === medId)

  useEffect(() => {
    if (token && medicines.length === 0) {
      getMedicines()
    }
  }, [token, medicines])

  console.log(data)


  return data && (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-center">{data.name}</h2>
        <img
          src={data.image}
          alt={data.name}
          className="w-64 h-64 object-contain mb-6 rounded"
        />
        <p className="text-xl font-semibold mb-4 text-blue-700">
          Price: <span className="font-bold">{data.price} VND</span>
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mb-6 transition"
          onClick={() => navigate('/manage-medicine')}
        >
          Buy Now
        </button>
        <div className="w-full">
          <h3 className="text-xl font-bold mb-2">Description</h3>
          <p className="text-base mb-4">{data.description}</p>
          <h3 className="text-xl font-bold mb-2">Dosage</h3>
          <p className="text-base">{data.dosage}</p>
        </div>
      </div>
    </div>
  )
}


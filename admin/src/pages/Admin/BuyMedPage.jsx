




import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

const BuyMedPage = () => {

  const { backendURL, aToken, getMedicines, medicines, setMedicines } = useContext(AdminContext)
  const navigate = useNavigate()

  const medId = useParams().medId
  const data = medicines.find(med => med._id === medId)

  useEffect(() => {
    if (aToken && medicines.length === 0) {
      getMedicines()
    }
  }, [aToken, medicines])

  console.log(data)




  return data && (
    <div>
      <div>Buy Medicine Page </div>
      <div className='flex flex-col items-center justify-center'>
        <h2 className='text-2xl font-bold mb-4'>{data.name}</h2>
        <img src={data.image} alt={data.name} className='w-1/2 h-auto mb-4' />
        <p className='text-lg mb-4'>Price: {data.price} VND</p>
        <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => navigate('/manage-medicine')}>Buy Now</button>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <h2 className='text-2xl font-bold mb-4'>Description</h2>
        <p className='text-lg mb-4'>{data.description}</p>
        <h2 className='text-2xl font-bold mb-4'>Dosage</h2>
        <p className='text-lg mb-4'>{data.dosage}</p>


      </div>
    </div>
  )
}

export default BuyMedPage
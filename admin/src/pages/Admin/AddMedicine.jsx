

import React from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AddMedicine = () => {


    const { backendURL, aToken } = useContext(AdminContext)
    const [medImg, setMedImg] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [quantity, setQuantity] = useState('')
    const [isAvailable, setIsAvailable] = useState(true)
    const [date , setDate] = useState(Date.now())

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        
    try {
        if (!medImg) {
            return toast.error("Image not selected")
        }

        const formData = new FormData()
        formData.append('image', medImg)
        formData.append('name', name)
        formData.append('description', description)
        formData.append('price', Number(price))
        formData.append('quantity', Number(quantity))
        formData.append('isAvailable', isAvailable)
        formData.append('date', date)

        const { data } = await axios.post(backendURL + '/api/admin/add-medicine', formData, { headers : {aToken}  });

        if (data.success === true){
            toast.success(data.message )
            setName('')
            setDescription('')
            setPrice('')
            setQuantity('')
            setIsAvailable(true)
            setDate(Date.now())
        } else {
            toast.error(data.message)
        }
        
    } catch (error) {
        toast.error(error.message)

    }
    }

return (
    <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">Add Medicine</h1>

            <form onSubmit={onSubmitHandler} className="space-y-6">
                <div className="grid gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="medImg" className="font-medium text-gray-700">Medicine Image</label>
                        <input 
                            type="file" 
                            id="medImg" 
                            className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500 w-full" 
                            onChange={(e) => setMedImg(e.target.files[0])} 
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="font-medium text-gray-700">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500 w-full" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="description" className="font-medium text-gray-700">Description</label>
                        <textarea 
                            id="description" 
                            className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500 w-full min-h-[100px]" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="price" className="font-medium text-gray-700">Price</label>
                            <input 
                                type="number" 
                                id="price" 
                                className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500 w-full" 
                                value={price} 
                                onChange={(e) => setPrice(e.target.value)} 
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="quantity" className="font-medium text-gray-700">Quantity</label>
                            <input 
                                type="number" 
                                id="quantity" 
                                className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500 w-full" 
                                value={quantity} 
                                onChange={(e) => setQuantity(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="isAvailable" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            checked={isAvailable} 
                            onChange={(e) => setIsAvailable(e.target.checked)} 
                        />
                        <label htmlFor="isAvailable" className="font-medium text-gray-700">Available</label>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors w-full md:w-auto"
                    >
                        Add Medicine
                    </button>
                </div>
            </form>
        </div>
    </div>
)
}

export default AddMedicine
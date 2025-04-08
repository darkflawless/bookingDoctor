import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1')
    const [fees, setFees] = useState('')
    const [speciality, setSpeciality] = useState("General physician")
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [about, setAbout] = useState('')

    const { backendURL, aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (!docImg) {
                return toast.error("Image not selected")
            }

            const formData = new FormData()
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({line1:address1, line2:address2}))
            formData.append('about', about)

            //log form data
            formData.forEach((value, key)=>{
                console.log(`${key} : ${value}`);
                
            })

            const { data } = await axios.post(backendURL + '/api/admin/add-doctor', formData, { headers : {aToken}  });

            if (data.success === true){
                toast.success(data.message )
                setName('')
                setEmail('')
                setPassword('')
                setExperience('')
                setFees('')
                setSpeciality("General physician")
                setDegree('')
                setAddress1('')
                setAddress2('')
                setAbout('')
                setDocImg(false)
            } else {
                toast.error(data.message )
            }

        } catch (error) {
            toast.error(error)
            
        }

    }

    return (
        <form onSubmit={onSubmitHandler} action="" className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Add Doctor</h2>
            <div className="flex flex-col items-center mb-4">
                <label htmlFor="doc-img" className="cursor-pointer">
                    <img src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="Upload" className="w-32 h-32 object-cover mb-2" />
                </label>
                <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                <p className="text-sm text-gray-500">Upload doctor pic</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Doctor's Name</label>
                        <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Name' required className="mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Doctor's Email</label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email' required className="mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required className="mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Experience : Year</label>
                        <input onChange={(e) => setExperience(e.target.value)} value={experience} type="number" placeholder='Exp' required className="mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Fees</label>
                        <input onChange={(e) => setFees(e.target.value)} value={fees} type="number" placeholder='Fees' required className="mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Speciality</label>
                        <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className="mt-1 p-2 border border-gray-300 rounded-md">
                            <option value="General physician">General physician</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatricians">Pediatricians</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Gastroenterologist">Gastroenterologist</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Education</label>
                        <input onChange={(e) => setDegree(e.target.value)} value={degree} type="text" placeholder='Education' required className="mt-1 p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            onChange={(e) => setAddress1(e.target.value)}
                            value={address1}
                            type="text"
                            placeholder='Address1'
                            required
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full" // Thêm w-full
                        />
                        <input
                            onChange={(e) => setAddress2(e.target.value)}
                            value={address2}
                            type="text"
                            placeholder='Address2'
                            required
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full" // Thêm w-full
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">About</label>
                        <textarea className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            onChange={(e) => setAbout(e.target.value)} value={about} placeholder='About doctor' rows={3} required ></textarea>
                    </div>
                </div>
            </div>

            <button type='submit ' className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600">
                Add Doctor
            </button>
        </form>
    )
}

export default AddDoctor

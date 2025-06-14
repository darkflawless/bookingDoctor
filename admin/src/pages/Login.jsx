import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets.js'
import { AdminContext } from '../context/AdminContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext.jsx'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [state , setState] = useState('Admin')
    const {setAToken, backendURL} = useContext(AdminContext) 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {setDToken} = useContext(DoctorContext)
    const navigate = useNavigate()

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            if (state === 'Admin') {
                
                const {data} = await axios.post(backendURL+'/api/admin/login', {email, password})
                

                if (data.success) { 
                    localStorage.setItem('aToken', data.token)
                    setAToken(data.token)
                    console.log(data.token);
                    navigate('/admin-dashboard')
                } else {
                    toast.error(data.message)
                }  

            } else {

                const {data} = await axios.post(backendURL+'/api/doctor/login', {email, password})
                if (data.success) { 
                    localStorage.setItem('dToken', data.token)
                    setDToken(data.token)
                    navigate('/doctor-dashboard')
                    console.log(data.token);
                } else {
                    toast.error(data.message)
                }  

           
            }
        } catch (error) {
            console.log("Error:", error.response ? error.response.data : error.message);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center'>
            <div className='flex flex-col gap-4 m-auto items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white'>
                <p className='text-2xl font-semibold text-center'>
                    <span className='text-primary'>{state === 'Admin' ? 'Admin Login' : 'Doctor Login'}</span>
                </p>
                <div className='w-full'>
                    <p>Email</p>
                    <input onChange={e => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1 bg-gray-100 focus:outline-none focus:border-primary' type="email" required />
                </div>                                                                                                                                                            
                <div className='w-full'>
                    <p>Password</p>
                    <input onChange={e => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1 bg-gray-100 focus:outline-none focus:border-primary' type="password" required />
                </div>
                <button className='w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors duration-300 mt-4'>
                    Login
                </button>
                {
                    state === 'Admin'
                    ? 
                    <p> Doctor Login ? <span className='text-primary underline cursor-pointer' onClick={() => setState('Doctor')}>Click Here</span> </p>
                    : <p> Admin Login ? <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')}>Click Here</span> </p>
                }
            </div>
        </form>
    );
}

export default Login

import React, { useContext, useState , useEffect } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';



export const Navbar = () => {

    const navigate = useNavigate() ;
    const {token , setToken , userData , setUserData , loadUserProfileData } = useContext(AppContext)
    const [ showMenu , setShowMenu ] = useState(true);

    const logout = () =>{

        setToken(false)
        localStorage.removeItem('token')
        setUserData({})
        navigate('/')

    }
    useEffect (() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">

        <img onClick={()=> {navigate('/')} } className='w-44 cursor-pointer' src = {assets.logo} alt = ""/>
        <ul className='hidden md:flex items-center gap-5 font-medium'>
            <NavLink to='/'>
                <li className ='py-1'>
                    HOME
                </li>
                <hr className = 'border-none outline-none h-0.5 bg-primary w-4/5 m-auto hidden' />
            </NavLink>
            <NavLink to='/doctors'>
                <li className ='py-1'>
                    ALL DOCTORS
                </li>
                <hr className = 'border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to ='/contact'>
                <li className ='py-1'>
                    CONTACT
                </li>
                <hr className = 'border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to = '/about'>
                <li className ='py-1'>
                    ABOUT
                </li>
                <hr className = 'border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to = '/manage-medicine'>
                <li className ='py-1'>
                    MEDICINE
                </li>
                <hr className = 'border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>


        </ul>
        <div className = 'flex items-center gap-4'>

            {
            token && userData ?
            <div className = "flex items-center gap-2 cursor-pointer group relative">
                <img className ='w-8 rounded-full' src={userData.image} alt =''/>
                <img className ='w-2.5' src={assets.dropdown_icon} alt =''/>

                <div className = 'absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                    <div className = 'min w-48 bg-stone-100 rounded flex flex-col gap-4 pt-4'>
                    <p onClick={()=> navigate('my-profile') } className ='hover:text-black cursor-pointer pl-4' >My Profile</p>
                    <p onClick={()=> navigate('my-appointments') } className ='hover:text-black cursor-pointer pl-4' >My Appointment</p>
                    <p onClick={() => logout()} className ='hover:text-black cursor-pointer pl-4' >Log Out</p>
                    </div>
                </div>

            </div>
            :<button onClick={()=> navigate('/login')  } className="bg-primary text-white px-8 py-3 rounded full font-light hidden md:block">
                Create Account
            </button>

            }
            <img onClick={()=> setShowMenu(false)} className ='w-6 md:hidden' src={assets.menu_icon} alt="" />

        </div>

    </div>
  )
}


import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext';

const Navbar = () => {
    const {aToken, setAToken} = useContext(AdminContext)
    const {dToken , setDToken} = useContext(DoctorContext)

    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        aToken && setAToken("")
        aToken && localStorage.removeItem('aToken')
        dToken && setDToken("")
        dToken && localStorage.removeItem('dToken')
    }

    return (
      <div className="flex items-center justify-between p-4 bg-white shadow-md border-b border-gray-200">
        {/* Phần bên trái: Logo và trạng thái */}
        <div className="flex items-center space-x-4">
          <img src={assets.admin_logo} alt="Logo" className="h-15 w-15" /> {/* Điều chỉnh kích thước logo */}
          <p className="text-lg font-semibold text-gray-700">
            {aToken ? 'Admin' : 'Doctor'}
          </p>
        </div>
  
        {/* Phần bên phải: Nút Logout */}
        <button
          onClick={logout}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition duration-300"
        >
          Log Out
        </button>
      </div>
    );
  };
  
  export default Navbar;


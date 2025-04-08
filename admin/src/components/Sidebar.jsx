

import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext';

const Sidebar = () => {

    const {aToken} = useContext(AdminContext)
    const {dToken} = useContext(DoctorContext)
    return (
        <div className="min-h-screen bg-white border-r border-gray-200 w-64">
          {aToken && (
            <ul className="space-y-2 p-4">
              <li>
                <NavLink
                  to="/admin-dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition duration-300 ${
                      isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <img src={assets.home_icon} alt="Home" className="h-6 w-6" />
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/all-appointments"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition duration-300 ${
                      isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <img src={assets.appointment_icon} alt="Appointment" className="h-6 w-6" />
                  <p>Appointment</p>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/add-doctor"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition duration-300 ${
                      isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <img src={assets.add_icon} alt="Add Doctor" className="h-6 w-6" />
                  <p>Add Doctor</p>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/doctor-list"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition duration-300 ${
                      isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <img src={assets.people_icon} alt="Doctor List" className="h-6 w-6" />
                  <p>Doctor List</p>
                </NavLink>
              </li>
            </ul>
          )}
          
          {dToken && (
            <ul className="space-y-2 p-4">
              <li>
                <NavLink
                  to='/doctor-dashboard'
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition duration-300 ${
                      isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <img src={assets.home_icon} alt="Home" className="h-6 w-6" />
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/doctor-appointments'
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition duration-300 ${
                      isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <img src={assets.appointment_icon} alt="Appointment" className="h-6 w-6" />
                  <p>Appointment</p>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to='doctor-profile'
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition duration-300 ${
                      isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <img src={assets.people_icon} alt="Doctor List" className="h-6 w-6" />
                  <p>Pofile</p>
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      );
    };
    
    export default Sidebar;
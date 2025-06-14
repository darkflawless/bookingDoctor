

import React, { useContext } from 'react';
import Login from './pages/Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from './context/AppContext';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AddDoctor from './pages/Admin/AddDoctor';
import AllAppointments from './pages/Admin/AllAppointments';
import DoctorList from './pages/Admin/DoctorList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import ManageMedicine  from './pages/Admin/ManageMedicine.jsx';
import AddMedicine from './pages/Admin/AddMedicine.jsx';
import BuyMedPage from './pages/Admin/BuyMedPage.jsx';
import Statistics from './pages/Admin/Statistics.jsx';
import UserList from './pages/Admin/UserList.jsx';
import Schedule from './pages/Admin/Schedule.jsx';


const App = () => {

  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD] min-h-screen'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start p-6 gap-6'>
        <Sidebar />
        <Routes className='flex-1 bg-white rounded-lg shadow-md p-6'>

           {/* admin routes */}
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorList />} />
            {/* doctor routes */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
          <Route path='/doctor-appointments' element={<DoctorAppointment/>} />
          <Route path='/doctor-profile' element={<DoctorProfile/>} />
          <Route path='/manage-medicine' element={<ManageMedicine/>} />
          <Route path='/add-medicine' element={<AddMedicine/>} />
          <Route path = '/medicine/:medId' element = { <BuyMedPage/> } />
          <Route path = '/manage-medicine/:typeOf' element = { <ManageMedicine/> } />
          <Route path='/statistics' element={< Statistics />} />
          <Route path='/user-list' element={<UserList />} />
          <Route path='/schedule' element={<Schedule />} />
          
          {/* doctor routes */}


        </Routes>
      </div>
    </div>
  )
    :
    (
      <>
        <Login />
        <ToastContainer />
      </>
    )
}

export default App

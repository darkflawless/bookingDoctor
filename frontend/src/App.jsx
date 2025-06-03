import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Contact } from './pages/Contact';
import { Doctors } from './pages/Doctors';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { MyAppointment } from './pages/MyAppointment';
import { MyProfile } from './pages/MyProfile';
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer';
import { ChatBot } from './components/ChatBot';
import { PayPalPage } from './pages/PayPalPage';
import { Medicine } from './pages/Medicine';
import { BuyMed } from './pages/BuyMed';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Appointment } from './pages/Appointment';

export const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={ <Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-appointments' element={<MyAppointment />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/paypal' element={<PayPalPage />} />
        <Route path='/manage-medicine' element={<Medicine />} />
        <Route path='/manage-medicine/:typeOf' element={<Medicine />} />
        <Route path='/medicine/:medId' element={< BuyMed />} />
      </Routes>
      <ChatBot />
      <Footer />

    </div>
  );
};

export default App;

import React from 'react'
import { assets } from '../assets/assets'

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className='text-center text-3xl pt-10 text-gray-600'>
        <p> ABOUT <span className='text-gray-800 font-semibold'> US </span> </p>
      </div>

      <div className='my-16 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[400px] rounded-lg shadow-lg' src={assets.about_image} alt="About Us" />

        <div className='flex-1 flex flex-col justify-center gap-8 text-base text-gray-800'>
          <p>Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
          <p>Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.</p>
          <b className="text-lg">Our Vision</b>
          <p>Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
        </div>
      </div>

      <div className='text-2xl my-8 text-gray-700'>
        <p> WHY <span className='text-gray-900 font-bold'>CHOOSE US</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ô vuông 1 */}
        <div className="p-8 bg-white border border-gray-300 rounded-2xl shadow-lg hover:bg-primary hover:text-white transition-all duration-300">
          <h2 className="text-xl font-bold mb-4">EFFICIENCY:</h2>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        {/* Ô vuông 2 */}
        <div className="p-8 bg-white border border-gray-300 rounded-2xl shadow-lg hover:bg-primary hover:text-white transition-all duration-300">
          <h2 className="text-xl font-bold mb-4">CONVENIENCE:</h2>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>

        {/* Ô vuông 3 */}
        <div className="p-8 bg-white border border-gray-300 rounded-2xl shadow-lg hover:bg-primary hover:text-white transition-all duration-300">
          <h2 className="text-xl font-bold mb-4">PERSONALIZATION:</h2>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

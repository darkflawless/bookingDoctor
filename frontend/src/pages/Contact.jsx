import React from 'react'
import { assets } from '../assets/assets'

export const Contact = () => {
  return (
  <div className="flex flex-col md:flex-row gap-12 p-8 items-center">
    {/* Thẻ div chứa ảnh */}
    <div className="w-full md:w-2/5">
      <img 
        src={assets.contact_image} 
        alt="Contact Us" 
        className="w-full h-auto rounded-lg shadow-md"
      />
    </div>

    {/* Thẻ div chứa text */}
    <div className="w-full md:w-1/3 flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-4">CONTACT US</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">OUR OFFICE</h3>
        <p className="text-gray-600">00000 </p>
        <p className="text-gray-600">HANOI 000, HADONG, VIETNAM</p>
        <p className="text-gray-600">Tel: (000) 000-0000</p>
        <p className="text-gray-600">Email: </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">CAREERS AT OUR COMPANY</h3>
        <p className="text-gray-600 mb-4">Learn more about our teams and job openings.</p>
        <button className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors duration-300 ">
          Explore Jobs
        </button>
      </div>
    </div>
  </div>
  )
}

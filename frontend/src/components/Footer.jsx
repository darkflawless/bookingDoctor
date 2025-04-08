import React from 'react'
import { assets } from '../assets/assets'

export const Footer = () => {
  return (
    <div>
        {/* --- Left Section --- */}
        <div>
            <img className ='flex items-center justify-between text-sm py-4 pb-20 mb-5 gray-400 pt-20 ' src={assets.logo} alt="Logo" />
            <p></p>
        </div>

        {/* --- Center Section --- */}
        <div>
            <p></p>
            <ul>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>

        {/* --- Right Section --- */}
        <div>
            <p></p>
        </div>
    </div>
  )
}



import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import {toast} from 'react-toastify';


export const DoctorContext = createContext()

const DoctorContextProvider = (props) =>{

    const backendURL = import.meta.env.VITE_BACKEND_URL

    const [dToken , setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')

    const [appointments , setAppointments] = useState([])

    const [dashboardData , setDashboardData] = useState(false)

    const [doctorProfile , setDoctorProfile] = useState(false)


    const getAppointments = async () => {


        try {
                
            const response = await axios.get(backendURL + '/api/doctor/appointments', 
            {headers : { dToken }} ) 
            
            const data = response.data;

            if (data?.success){
                setAppointments(data.appointments.reverse()) ;
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }

    }

    const completeAppointment = async (appointmentId) => {
        
        try {

            const {data} = await axios.post(backendURL + '/api/doctor/complete-appointment', {appointmentId} , {headers : { dToken }} ) ;
            
            if (data.success){
                getAppointments()
                toast.success( data.message )
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
    }

    const cancelAppointment = async (appointmentId) => {
        
        try {

            const {data} = await axios.post(backendURL + '/api/doctor/cancel-appointment', {appointmentId} , {headers : { dToken }} ) ;
            
            if (data.success){
                getAppointments()
                toast.success( data.message )
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
    }

    const getDoctorDashboard = async () => {
        try {
            const {data} = await axios.get(backendURL + '/api/doctor/dashboard', {headers : { dToken }} );
            console.log(data.data)
            setDashboardData(data.data)
            if (data.success){
                return data
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getDoctorProfile = async () => {
        try {
            const {data} = await axios.get(backendURL + '/api/doctor/profile', {headers : { dToken }} );
            if (data.success){
                console.log(data.doctor)
                setDoctorProfile(data.doctor)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const updateDoctorProfile = async (formData) => {
        try {
            const {data} = await axios.post(backendURL + '/api/doctor/update-profile', formData , {headers : { dToken }} );
            if (data.success){
                toast.success(data.message)
                getDoctorProfile()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }
    const updateDoctorPassword = async (formData) => {
        try {
            const {data} = await axios.post(backendURL + '/api/doctor/update-password', formData , {headers : { dToken }} );
            if (data.success){
                toast.success(data.message)
                getDoctorProfile()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const value = {
        dToken , setDToken , backendURL ,
        appointments , setAppointments , getAppointments , 
        completeAppointment , cancelAppointment , getDoctorDashboard , 
        setDashboardData , dashboardData , getDoctorProfile , doctorProfile , 
        setDoctorProfile , updateDoctorProfile , updateDoctorPassword

    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider;
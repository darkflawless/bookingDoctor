import { createContext } from "react";
import axios from 'axios'
import { useState } from "react";
import { useEffect } from "react";
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '$'
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [doctors, setDoctors] = useState([])
    const [userData, setUserData] = useState({}) // Changed from false to an empty object
    const [pageNum, setPageNum] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [medicines, setMedicines] = useState([])

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/doctor/list', { params: { pageNum, pageSize: 5 } })
            if (data.success === true) {
                setDoctors(data.doctors)
                setTotalPages(data.totalPages || 1)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getDoctorsData();
    }, [pageNum]);

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/user/get-profile', { headers: { token } })
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getMedicines = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/user/get-medicines', { headers: { token } })
            if (data.success) {
                setMedicines(data.medicines)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        doctors, getDoctorsData,
        currencySymbol,
        token, setToken, backendURL, loadUserProfileData, userData, setUserData,// Added userData and setUserData to context
        pageNum, setPageNum, totalPages, setTotalPages , getMedicines , setMedicines, medicines
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
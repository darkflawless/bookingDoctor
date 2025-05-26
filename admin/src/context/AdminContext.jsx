

import { createContext, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';


export const AdminContext = createContext()
const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [doctors, setDoctors] = useState([])
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [pageNum, setPageNum] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [medicines, setMedicines] = useState([])
    const [users, setUsers] = useState([]); // added users state
    const [usersTotalPages, setUsersTotalPages] = useState(1); // added users total pages state
    const [usersPageNum, setUsersPageNum] = useState(1); // added users page number state

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(backendURL + '/api/admin/all-doctors', {}, { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
                console.log(data.doctors)
            } else {
                toast.error(data.message)

            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeAvailability = async (docId) => {
        try {

            const { data } = await axios.post(backendURL + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // New function to get users with pagination
    const getUsers = async (page = 1) => {
        try {
            const { data } = await axios.get(`${backendURL}/api/admin/get-user`, {
                params: { pageNum: page },
                headers: { aToken },
            });
            if (data.success) {
                setUsers(data.users);
                // Assuming backend returns totalPages, if not, set to 1
                setUsersTotalPages(data.totalPages || 1);
                setUsersPageNum(page);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // New function to delete user by id
    const deleteUser = async (userId) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/admin/delete-user`, 
                { userId },
                { headers: { aToken }}
            );
            if (data.success) {
                toast.success('User deleted successfully');
                // Refresh user list after deletion
                getUsers(usersPageNum);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    const completeAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendURL + '/api/admin/complete-appointment', { appointmentId }, { headers: { aToken } });

            if (data.success) {
                getAllAppointments()
                toast.success(data.message)
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
            const { data } = await axios.post(backendURL + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendURL}/api/admin/all-appointments`, {
                params: { pageNum },
                headers: { aToken },
            });
            if (data.success) {
                console.log(data.totalAppointments)
                setAppointments(data.appointments)
                setTotalPages(data.totalPages || 1);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/admin/dashboard', { headers: { aToken } })

            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData);

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const deleteDoctor = async (doctorId) => {
        try {
            const { data } = await axios.post(backendURL + '/api/admin/delete-doctor', { doctorId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getMedicines = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/admin/get-medicines', { headers: { aToken } })
            if (data.success) {
                setMedicines(data.medicines)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const [topDoctorsStats, setTopDoctorsStats] = useState([])

    const getTopDoctorsStats = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/admin/get-top-doctors', { headers: { aToken } })
            if (data.success) {
                setTopDoctorsStats(data.topDoctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }



    const value = {
        aToken, setAToken, backendURL, doctors
        , getAllDoctors, changeAvailability, getAllAppointments,
        appointments, setAppointments, cancelAppointment, completeAppointment ,
         dashData, getDashData
        , pageNum, setPageNum, totalPages, setTotalPages, deleteDoctor, getMedicines
        , medicines, setMedicines,
        topDoctorsStats, getTopDoctorsStats,
        users, setUsers, usersPageNum, setUsersPageNum, usersTotalPages, setUsersTotalPages, getUsers, deleteUser
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider;

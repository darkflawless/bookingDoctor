
import { AppContext } from '../context/AppContext.jsx';
import { useContext , useState } from 'react';
import {assets} from '../assets/assets.js' 
import { toast } from 'react-toastify';
import axios from 'axios';

export const MyProfile = () => {
    const {userData, setUserData , token , backendURL, loadUserProfileData} = useContext(AppContext);
    if (!userData) return <div>Loading...</div>; // Added loading state check

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)

    const updateProfileData = async () => {
        try {
            const formData = new FormData();
            formData.append('userId', userData._id); // Include userId in the form data

            formData.append('name', userData.name);
            formData.append('phone', userData.phone);
            formData.append('address', JSON.stringify(userData.address));
            formData.append('gender', userData.gender);
            formData.append('dob', userData.dob);
            image && formData.append('image', image);
    
            // Log dữ liệu trong formData
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
    
            const { data } = await axios.post(backendURL + '/api/user/update-profile', formData, { headers: { token } });
    
            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
                setImage(false)
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    return  (
        <div className = 'max-w-lg flex flex-col gap-2 text-sm ' >

            {
                isEdit
                ? <label htmlFor="image">
                    
                    <div className = 'inline-block relative cursor-pointer'>
                        <img className='w-36 rounded opacity-75' src= {image ? URL.createObjectURL(image) : userData.image} alt="" />
                        <img className='w-10 absolute bottom-12 right-12' src= {image ? null : assets.upload_icon } alt="" />
                        <input onChange = {e => setImage(e.target.files[0])} type="file" id = "image" hidden />
                        
                    </div>

                </label> 
                :
                <img className = 'w-36 rounded' src={userData.image} alt="Profile" />
            }
            
            {
                isEdit ?
                    <input className = 'bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
                    : <p className='font-medium text-3xl text-neutral-800 mt-4' >{userData.name}</p>
            }
            <hr className = 'bg-zinc-400 h-[1px] border-none'/>

            <div >
                <p className = 'text-neutral-500 underline mt-3'> CONTACT INFO</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 text-neutral-700'>
                    <p className='font-medium'>Email :</p>
                    <p className='text-blue-500'>{userData.email}</p>
                    <p className='font-medium'>Phone :</p>
                    {
                        isEdit ?
                            <input className = 'bg-gray-200 max-w-52' type="text" value={userData.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
                            : <p className='text-blue-500'>{userData.phone}</p>
                    }
                    <p className='font-medium' >Address :</p>
                    {
                        isEdit ?
                            <p>
                                <input className = 'bg-gray-200 max-w-52'
                                    value={userData.address.line1}
                                    onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                    type="text" />
                                <br />
                                <input  className = 'bg-gray-200 max-w-52'
                                    value={userData.address.line2}
                                    onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                    type="text" />
                            </p>
                            : <p className='text-blue-500'>
                                {userData.address1}
                                <br />
                                {userData.address2}
                            </p>

                    }

                </div>
            </div>
            <div>
                <p className = 'text-neutral-500 underline mt-3'>
                    BASIC INFO
                </p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 text-neutral-700'>
                    <p className='font-medium'>Gender :</p>
                    {
                        isEdit ?
                            <select className = 'bg-gray-200 max-w-28' onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>

                            : <p  className = 'text-blue-500'>{userData.gender}</p>
                    }
                    <p className='font-medium'>
                        Birthday :
                    </p>
                    {
                        isEdit ? 
                        <input className = 'bg-gray-200 max-w-28'  type="date" onChange={e => setUserData(prev => ({...prev , dob : e.target.value})) } value = {userData.dob}/>
                        : <p className = 'text-blue-500'>
                            {userData.dob}
                        </p>

                    }

                </div>
                
            </div>
            <div className = 'pt-6 py-6' >
                {
                    isEdit ?
                    <button className = 'border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={updateProfileData} >Save</button> :
                    <button className = 'border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setIsEdit(true)}>Edit</button>
                }

            </div>
        </div>
    );
};

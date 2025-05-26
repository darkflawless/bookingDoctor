import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';


export const Appointment = () => {

    const { docId } = useParams()
    const { doctors , currencySymbol, getDoctorsData , backendURL , token  } = useContext(AppContext) 
    const navigate = useNavigate()
    const [docInfo , setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState ([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime , setSlotTime] = useState('')
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    const fetchDocInfo = async ()=> {
      const docInfo = doctors.find(doc => doc._id === docId)
      setDocInfo(docInfo)
    }

    const getAvailableSlot = async () => {
      setDocSlots([]);
    
      let today = new Date();
      for (let i = 0; i < 7; i++) {
        // Lấy ngày hiện tại cộng thêm i ngày
        let currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        let endTime = new Date(currentDate);
        endTime.setHours(21, 0, 0, 0); // Kết thúc lúc 21:00
    
        // Thiết lập thời gian bắt đầu
        if (i === 0) {
          // Nếu là ngày hiện tại, bắt đầu từ thời gian hiện tại + 30 phút
          currentDate.setHours(currentDate.getHours()+1)
          currentDate.setMinutes(currentDate.getMinutes() >= 30 ? 30 : 0);

        } else {
          // Nếu không phải ngày hiện tại, bắt đầu từ 10:00
          currentDate.setHours(10, 0, 0, 0);
        }
    
        let timeSlot = [];
        while (currentDate < endTime) {
          
          
          // Kiểm tra xem thời gian hiện tại đã vượt qua khung giờ này chưa
          if (i > 0 || currentDate > today) {
            let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let day = currentDate.getDate()
            let month = currentDate.getMonth() + 1
            let year = currentDate.getFullYear()

            const slotDate = day+ "_"+ month + "_" + year
            const slotTime = formattedTime

            const isSlotAvailable = docInfo?.slots_booked?.[slotDate]?.includes(formattedTime) ? false : true;

        

            if (isSlotAvailable) {
              timeSlot.push({
                datetime: new Date(currentDate),
                time: formattedTime,
              })
            }
          }
          // Tăng thời gian lên 30 phút
          currentDate.setMinutes(currentDate.getMinutes() + 30);
        }
    
        setDocSlots((prev) => [...prev, timeSlot]);
      }
    };

    const bookAppointment = async () => {
      if (!token){
        toast.warn('Login to book Appointment')
        return navigate('/login')
      }
      try {
        const date = docSlots[slotIndex][0].datetime
        

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const {data} = await axios.post(backendURL + '/api/user/book-appointment', 
          { docId, slotDate, slotTime } , {headers : {token}} )
        
          if (data.success){
            toast.success('Appointment booked successfully')
            getDoctorsData()
            navigate('/my-appointments')

          } else {
              toast.error(data.message)
          }

      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }

    }

    useEffect( ()=>{
      fetchDocInfo()
    } , [ doctors , docId] )

    useEffect (()=>{
      getAvailableSlot()
    }, [docInfo] )

    useEffect (()=> {
      console.log(docSlots)
    }, [docSlots])

    return docInfo && (
      <div>
          {/*---doctor details */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <div>
              <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
            </div>
            <div className = 'flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[80px] sm:mt-0'>
                {/*----docinfo : name  , degree , exp -----*/}
                <p className='flex items-center gap-2 text-2xl font-medium text-gray-900 '> 
                   {docInfo.name} <img src={assets.verified_icon} alt="" /></p>
                <div>
                  <p> {docInfo.degree} - {docInfo.speciality} </p>
                  <button>
                    {docInfo.experience}
                  </button>
                </div>
                 {/* ----- about doctor ---- */} 
                 <div>
                  <p className ='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'> About <img src={assets.info_icon} alt="" /> </p>
                  <p> {docInfo.about} </p>
                 </div>
                  <p className = 'flex flex-row '>
                     Appointment fee : <span > {currencySymbol }{docInfo.fees}</span>
                  </p>
            </div>
          </div>
          {/* --- booking slot */}
          {/* --- booking slot */}
          <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
            <p>Booking Slots</p>
            <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
              {docSlots.length > 0 && docSlots.map((item, index) => (
                <div 
                onClick={() => setSlotIndex(index)}
                className={`text-center py-4 px-2 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index ? 'bg-primary text-white' : 'border border-gray-400 text-gray-900'
                }`}
                key={index}
                  >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
            </div>
              <div className='flex items-center gap-3 w-full overflow-x-auto mt-4 scrollbar-visible'>
              {docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
                <p
                  key={index}
                  onClick={()=> setSlotTime(item.time)}
                  className= {`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200
                     ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}` }
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
            </div>
                 <button onClick = {bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
                  Book an Appointment
                 </button>
          </div>
          <div>
             {/* listing related doctors */}
             <RelatedDoctors docId = {docId} speciality = {docInfo.speciality}  />


          </div>
      </div>
    )
}

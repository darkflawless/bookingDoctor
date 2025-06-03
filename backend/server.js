

import express, { application } from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCoudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import payRouter from './routes/payRoute.js'
import './jobs/order-checker.js'; // chạy code setup cron



//app config
const app = express()
const port = process.env.PORT || 3000
connectDB()
connectCoudinary()


// middleware 
app.use(express.json())
app.use(cors())

//api
app.use('/api/admin', adminRouter )
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter )
app.use('/api/payment', payRouter )


//localhost :3000/api/admin/add-doctor



app.get('/', (req, res) => {
    res.send('Hello World! This is working great')
})

app.listen(port, ()=> console.log("Server Started" , port) )

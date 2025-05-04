


import mongoose, { mongo } from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId : { type : String , required : true },
    docId : { type : String , required : true },
    slotDate : { type : String , required : true },
    slotTime : { type : String , required : true },
    userData : { type : Object , required : true },
    docData : { type : Object , required : true },
    amount : { type : Number , required : true },
    date : { type : Number , default : Date.now },
    cancelled : { type : Boolean , default : false },
    payment : { type : Boolean , default : false },
    isCompleted : { type : Boolean , default : false },
    dateBooked: { type: Date, required: true },
})

appointmentSchema.index({ userId: 1, dateBooked: -1 });

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)

export default appointmentModel ;
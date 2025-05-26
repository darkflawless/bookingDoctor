


import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name : { type : String , required : true },
    description : { type : String , required : true },
    image : { type : String , required : true },
    price : { type : Number , required : true },
    date : { type : Number , default : Date.now },
    typeOf : { type : String , default : "medicine" },
    quantity: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
})

medicineSchema.index({ date: 1, typeOf: 1 });// Create a text index on the name field

const medicineModel = mongoose.models.medicine || mongoose.model('medicine', medicineSchema)
export default medicineModel ;
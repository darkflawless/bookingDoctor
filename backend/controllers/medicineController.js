


import { v2 as cloudinary } from 'cloudinary';
import medicineModel from "../models/medicineModel.js";

const addMedicine = async (req, res) => {   
    try {
        const { name, description , price, quantity } = req.body;
        const imageFile = req.file

        if (!name || !description || !imageFile || !price || !quantity) {
            return res.json({ success: false, message: "Missing detail" });
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type :"image"})
        const imageUrl = imageUpload.secure_url

        const newMedicine = new medicineModel({
            name ,
            description,
            image : imageUrl,
            price,
            quantity
        });
        
        await newMedicine.save();

        res.json({ success: true, message: "Medicine added successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

const getMedicines = async (req, res) => {
    try {
        const pageNum = req.params
        const pageSize = 10
        const medicines = await medicineModel
        .find({})
        .sort ({ date: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .lean()
        res.json({ success: true, medicines });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const deleteMedicine = async (req, res) => {
    try {
        const { medicineId } = req.body;
        await medicineModel.findByIdAndDelete(medicineId);
        res.json({ success: true, message: "Medicine deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export { addMedicine, getMedicines, deleteMedicine }
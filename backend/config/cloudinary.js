
import { v2 as cloudinary} from 'cloudinary';

const connectCoudinary = async ()=> {
    cloudinary.config ({
        cloud_name : process.env.CLOUDINAY_NAME,
        api_key : process.env.CLOUDINARY_API_KEY,
        api_secret : process.env.CLOUDINARY_SECRET_KEY
    })
}

export default connectCoudinary  
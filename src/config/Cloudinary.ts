import axios from "axios";
import type { CloudinaryResponse } from "../entities/interface";

 const uploadImageToCloudinary = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); 
      
      const response = await axios.post<CloudinaryResponse>(
        `https://api.cloudinary.com/v1_1/dxltxqlpy/image/upload`, 
        formData
      );
      
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new Error('Image upload failed');
    }
  };
export default uploadImageToCloudinary;
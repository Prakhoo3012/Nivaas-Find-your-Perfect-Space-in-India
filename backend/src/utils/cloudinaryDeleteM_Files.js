import {v2 as cloudinary} from "cloudinary";
import fs from "fs"


cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


const deleteFromCloudinary = async (images) => {
    try {
        if (!images || images.length === 0) return [];

        const deletePromises = images.map(async (img) => {
            try {
                const result = await cloudinary.uploader.destroy(img.public_id);

                return {
                    public_id: img.public_id,
                    result: result.result // "ok" or "not found"
                };

            } catch (err) {
                return {
                    public_id: img.public_id,
                    result: "error"
                };
            }
        });

        const results = await Promise.all(deletePromises);

        return results;

    } catch (error) {
        console.error("Error deleting images:", error);
        return [];
    }
};

export {deleteFromCloudinary}
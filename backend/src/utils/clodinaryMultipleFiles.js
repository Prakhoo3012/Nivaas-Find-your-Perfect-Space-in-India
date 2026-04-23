import {v2 as cloudinary} from "cloudinary";
import fs from "fs"


cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

const uploadMultipleOnCloudinary = async (localFilePaths) => {
    try {
        if (!localFilePaths || localFilePaths.length === 0) return [];

        const uploadPromises = localFilePaths.map(async (filePath) => {
            try {
                const response = await cloudinary.uploader.upload(filePath, {
                    resource_type: "auto"
                });

                // delete local file after success
                fs.unlinkSync(filePath);

                return {
                    url: response.secure_url,
                    public_id: response.public_id
                };

            } catch (err) {
                // delete local file if failed
                fs.unlinkSync(filePath);
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);

        // remove failed uploads (null)
        return results
                .filter(item => item !== null)

    } catch (error) {
        console.error("Error uploading multiple files:", error);
        return [];
    }
};

export {uploadMultipleOnCloudinary}


/* To delete any photo from cloudinary
await cloudinary.uploader.destroy(public_id);
*/
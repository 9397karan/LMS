const cloudinary = require("cloudinary").v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cloudinary configuration
cloudinary.config({
    cloud_name: "dmgl7rj4i",
    api_key: "141339696346255",
    api_secret: "SBP_Lvjo2gEdX6XyURJ8jodjKZ0"
});

// Set uploads folder path relative to your project
const uploadFolder = path.join(__dirname, 'uploads');

// Check if the uploads folder exists, create it if it doesn't
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Multer setup for file upload
const upload = multer({
    dest: uploadFolder // Use relative path here
});

// Upload media to Cloudinary
const uploadMediaToCloudinary = async (file) => {
    try {
        const res = await cloudinary.uploader.upload(file, {
            resource_type: 'auto',
            transformation: [{
                quality: 'auto',
                fetch_format: 'auto'
            }]
        });
        return res;
    } catch (error) {
        console.log("Upload Cloudinary Error:", error.message);
    }
}

// Delete media from Cloudinary
const deleteMediaFromCloudinary = async (id) => {
    try {
        const res = await cloudinary.uploader.destroy(id, {
            resource_type: 'video'
        });
        return res;
    } catch (error) {
        console.log("Delete from Cloudinary Error:", error.message);
    }
}

module.exports = { upload, deleteMediaFromCloudinary, uploadMediaToCloudinary };

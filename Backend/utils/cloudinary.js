const cloudinary=require("cloudinary").v2
const multer=require('multer')

cloudinary.config({
        cloud_name:"dmgl7rj4i",
        api_key:"141339696346255",
        api_secret:"SBP_Lvjo2gEdX6XyURJ8jodjKZ0"
})

const upload=multer({dest:'/uploads'})

const uploadMediaToCloudinary=async(file)=>{
    try {
        const res=await cloudinary.uploader.upload(file,{
          resource_type:'auto',
            transformation:[{
                  quality:'auto',fetch_format:'auto'
            }]
        })
        return res
    } catch (error) {
     console.log("Upload Cloudinary Error:",error.message)   
    }
}

const deleteMediaFromCloudinary=async(id)=>{
    try {
        const res=await cloudinary.uploader.destroy(id,{
          resource_type:'video'
        })
        return res
    } catch (error) {
     console.log("Delete from Cloudinary Error:",error.message)   
    }
}

module.exports={upload,deleteMediaFromCloudinary,uploadMediaToCloudinary}
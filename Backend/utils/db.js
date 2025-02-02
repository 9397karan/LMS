const mongoose=require('mongoose')

const dbConnect=async()=>{
    try {
        await mongoose.connect('mongodb+srv://9793karanraj:ct6Lja8bOsEEMdHw@cluster0.zhzi3.mongodb.net/');
        console.log('db connected')
    } catch (error) {
     console.log('Error in connecting db')   
    }
}

module.exports={dbConnect}
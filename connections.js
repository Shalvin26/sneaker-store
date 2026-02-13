const mongoose=require('mongoose');

const connectDB=async(url)=>{
    try{
        await mongoose.connect(url);
        console.log("mongoDB connnected");

    }catch(error){
        console.error('mongoDB connection error:',error.message);
        process.exit(1);
    }
};

module.exports={connectDB}
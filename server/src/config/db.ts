import mongoose from "mongoose";

const connectDB = async () : Promise<void> => {
    const uri = process.env.MONGO_URI

    if(!uri){
        console.error('MONGO_URI is not defined in .evn');
        process.exit(1);
    }

    try{
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    }catch(error){
        console.error('MongoDB connection failed:',error);
        process.exit(1);
    }
}

export default connectDB;
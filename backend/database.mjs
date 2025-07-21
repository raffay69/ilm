import mongoose, { Schema } from 'mongoose'
import 'dotenv/config'


async function connect(){
    await mongoose.connect(process.env.MONGO_URI)
    console.log("DB connected")
}

connect()

const dataSchema  = new Schema({
    userID : {
        type : String,
        required : true,
    },
    fileName : {
        type : String,
        required : true
    },
    quality :{
        type : String,
        enum : ['low' , 'high']
    },
    content : {
        type : String,
        required : true
    },
    videoURL : {
        type : String,
        required : true
    }
},{
    timestamps : true
}) 

dataSchema.index({userID : 1 , createdAt : -1})

export const dataModel = mongoose.model('data' , dataSchema)

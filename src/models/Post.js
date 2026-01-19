import mongoose, { Schema } from "mongoose";


//POST Schema
const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})




// Model 
const Post = mongoose.model('Post', postSchema)
export default Post
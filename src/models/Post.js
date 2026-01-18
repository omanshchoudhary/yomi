import mongoose, { Schema } from "mongoose";


//POST Schema
const blogPostSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})




// Model 
const BlogPost = mongoose.model('BlogPost', blogPostSchema)
export default BlogPost
import mongoose, { Schema } from "mongoose";


//POST Schema
const blogPostSchema = new Schema({
    
})




// Model 
const BlogPost = mongoose.model('BlogPost', blogPostSchema)
export default BlogPost
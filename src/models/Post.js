import mongoose from "mongoose";

//POST Schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  { timestamps: true },
);

postSchema.index({ author: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });

// Model
const Post = mongoose.model("Post", postSchema);
export default Post;

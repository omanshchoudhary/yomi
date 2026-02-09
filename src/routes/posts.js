import express from "express";
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "../controllers/postController.js";

import auth from "../middlewares/auth.js";
const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/',auth, createPost);
router.put('/:id',auth, updatePost);
router.delete('/:id',auth, deletePost)
export default router;

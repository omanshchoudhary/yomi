import express from "express";
import { getUserPost } from "../controllers/userController.js";
const route = express.Router();


route.get('/:id/posts', getUserPost);

export default route

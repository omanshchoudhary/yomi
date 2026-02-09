import express from "express";
import { createUser, handleLogin } from "../controllers/authController.js";

const route=express.Router();

route.post('/register', createUser)

route.post('/login', handleLogin)

export default route
import express from "express";
import { featured } from "../controllers/contFeatured.js";



const router = express.Router();

router.get("/", featured)

export default router
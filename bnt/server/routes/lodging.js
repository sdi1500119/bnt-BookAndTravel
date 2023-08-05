import express from "express";
import { lodging } from "../controllers/contLodging.js";



const router = express.Router();

router.get("/:id", lodging)

export default router
import express from "express";
import { locations } from "../controllers/contLocations.js";

const router = express.Router();

router.get("/", locations)

export default router
import express from "express";
import { pois } from "../controllers/contPois.js";

const router = express.Router();

router.get("/:poiCategory/:distance/:id", pois)

export default router
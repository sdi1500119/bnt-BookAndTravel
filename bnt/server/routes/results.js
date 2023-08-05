import express from "express";
import { results } from "../controllers/contResults.js";


const router = express.Router();

router.get("/:id", results)

export default router
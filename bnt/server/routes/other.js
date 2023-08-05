import express from "express";
import { other } from "../controllers/contOther.js";

const router = express.Router();

router.get("/:id", other)

export default router
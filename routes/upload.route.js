import express from "express";
import uploadCloud from "../middleware/uploadCloud.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/upload-cloud", uploadCloud.single("img"), uploadImage);

export default router;

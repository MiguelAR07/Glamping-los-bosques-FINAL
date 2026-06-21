import { Router } from "express";
import { getPromociones } from "../controller/promocion.controller.js";

const router = Router();

router.get("/", getPromociones);

export default router;

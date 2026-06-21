import { Router } from "express";
import { getBlockedDates } from "../controller/availability.controller.js";

const router = Router();

router.get('/', getBlockedDates);

export default router;

import { Router } from "express";
import { getServices } from '../controller/services.controller.js'

const router = Router();

router.get('/', getServices);

export default router;
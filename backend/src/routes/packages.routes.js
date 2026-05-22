import { Router } from "express";
import { getPackages, getTypes } from '../controller/packages.controller.js'

const router = Router();

router.get('/', getPackages);
router.get('/types', getTypes);

export default router;
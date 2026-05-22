import { Router } from "express";
import { getCabins, getCabinImages } from '../controller/cabin.controller.js'

const router = Router();

router.get('/', getCabins);
router.get('/images', getCabinImages);

export default router;
import { Router } from "express";
import { getCabins, getCabinImages, getCabinsFull } from '../controller/cabin.controller.js'

const router = Router();

router.get('/', getCabins);
router.get('/images', getCabinImages);
router.get('/full', getCabinsFull);

export default router;
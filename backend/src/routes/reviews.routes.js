import { Router } from "express";
import { getReviews, createReview } from '../controller/reviews.controller.js';

const router = Router();

router.get('/', getReviews);
router.post('/', createReview);

export default router;

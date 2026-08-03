import { Router } from "express";
import { getTerms } from "../controller/terms.controller.js";

const router = Router();

router.get('/', getTerms);

export default router;

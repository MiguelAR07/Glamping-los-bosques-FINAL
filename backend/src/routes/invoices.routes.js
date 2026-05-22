import { Router } from "express";
import { createInvoice } from "../controller/invoices.controller.js";

const router = Router();

router.post('/', createInvoice);

export default router;
import { Router } from "express";
import { getCuentasBancariasActivas } from "../controllers/cuentasBancarias.controller.js";

const router = Router();

router.get("/", getCuentasBancariasActivas);

export default router;
